import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';
import { TaxService } from 'src/tax/tax.service';
import { TaxDocument } from 'src/tax/schemas/tax-schema';
import { ProductDocument } from 'src/product/schemas/product.schema ';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly taxService: TaxService,
    private readonly stripeService: StripeService,
    private readonly paginationService: PaginationService,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    // const session = await this.stripeService.createCheckoutSession();
    // return session;

    const user = await this.userService.findOneById(createOrderDto.user);
    const cart = await this.cartService.findUserCart(createOrderDto.user);
    const tax = await this.taxService.findOne();

    let order: Order = {
      user: createOrderDto.user,
      items: [],
      shippingInfo: createOrderDto.shippingInfo,
      subtotal: 0,
      shippingFee: 0,
      tax: 0,
      totalPrice: 0,
      paymentInfo: {
        method: createOrderDto.paymentMethod,
        status: 'pending',
      },
      orderStatus: 'pending'
    };

    // await this.orderModel.create();

    for (const item of cart.items) {
      const product = (await this.productService.findOne(item.product)).date;
      if (item.quantity > product.quantity) {
        throw new BadRequestException(`No enough quantity`)
      }
      this.addItemToOrder(order, tax, product, item.quantity, item.color);
    }

    // console.log(order);

    let sessionUrl: string | null = null;
    if (createOrderDto.paymentMethod === 'CARD') {
      sessionUrl = await this.stripeService.createCheckoutSession(order);
    }

    const newOrder = await this.orderModel.create(order);

    await this.cartService.emptyUserCart(user._id.toString());

    return { newOrder, sessionUrl };
  }

  addItemToOrder(order: Order, tax: TaxDocument, product: ProductDocument, qunatity: number, color?: string) {
    const totalItemPrice = (product.discountPrice > 0 ? product.discountPrice : product.price) * qunatity;
    const productShippingFee = tax.shippingTaxRate * totalItemPrice;
    const productTax = tax.productTaxRate * totalItemPrice;

    order.items.push({
      product: product._id.toString(),
      name: product.name,
      color: color,
      quantity: qunatity,
      priceAtOrderTime: product.price,
      discountAtOrderTime: product.price - product.discountPrice,
      totalItemPrice: totalItemPrice,
    })

    order.subtotal += totalItemPrice;
    order.shippingFee += productShippingFee;
    order.tax += productTax;
    order.totalPrice += totalItemPrice + productShippingFee + productTax;

    return order;
  }

  async handleSuccessfullPayment(session: Stripe.Checkout.Session, eventType: Stripe.Event.Type) {
    if (eventType === 'checkout.session.completed') {
      const userId = session.metadata!['userId'];
      let order = await this.orderModel.findOne({ user: userId });
      if (order) {
        order.paymentInfo.status = 'paid';
        await order.save();

        order.items.forEach(async (item) => {
          await this.productService.updateProductPurchases(item.product, item.quantity);
        });

      }
    } else if (eventType === 'payment_intent.payment_failed') {
      const userId = session.metadata!['userId'];
      let order = await this.orderModel.findOne({ user: userId });
      if (order) {
        order.paymentInfo.status = 'failed';
        await order.save();
      }
    }
  }

  async findAll(userId: string, role: string, paginationDto: PaginationQueryDto) {
    if(role === 'admin') {
      return await this.paginationService.paginateQuery<OrderDocument, Order>(paginationDto, this.orderModel);
    } else {
      return await this.paginationService.paginateQuery<OrderDocument, Order>(paginationDto, this.orderModel, [], {user: userId});
    }
  }

  async findOne(id: string, userId: string, role: string) {
    const order = await this.orderModel.findById(id);
    if(order && role === 'user' && userId !== order.user.toString()) {
      throw new UnauthorizedException(`you are not allowed to view this order`);
    }

    if(!order) {
      throw new NotFoundException();
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

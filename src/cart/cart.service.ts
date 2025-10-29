import { BadGatewayException, BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart-schema';
import { Model } from 'mongoose';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { TaxService } from 'src/tax/tax.service';
import { DeleteFromCartDto } from './dto/delete-from-cart.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly taxService: TaxService,
    private readonly paginationService: PaginationService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async create(createCartDto: CreateCartDto) {
    // will throw an error if user is not found
    const user = await this.userService.findOneById(createCartDto.user);

    // will throw an error if there is no product
    const product = (await this.productService.findOne(createCartDto.item.product)).date;

    if(createCartDto.item.color) {
      if(!product.color.includes(createCartDto.item.color)) {
        throw new BadRequestException(`there is no ${createCartDto.item.color} of product with id: ${product._id}.`)
      }
    }

    if(product.quantity < createCartDto.item.quantity) {
      throw new BadGatewayException(`the quantity you is not avilable at the moment, you can buy at most ${product.quantity}.`)
    }

    // will throw an error if there is no tax;
    const tax = await this.taxService.findOne();

    createCartDto.item.priceAtAddTime = product.price * createCartDto.item.quantity;
    createCartDto.item.discountAtAddTime = (
      product.discountPrice ? (product.price - product.discountPrice) * createCartDto.item.quantity : 0
    );

    // total quantity price
    createCartDto.item.totalItemPrice = (
      createCartDto.item.priceAtAddTime -
      createCartDto.item.discountAtAddTime
    );
    createCartDto.totalPrice = createCartDto.item.totalItemPrice;

    // tax computation
    createCartDto.tax = (tax.shippingTaxRate + tax.productTaxRate) * createCartDto.item.totalItemPrice;

    let cart = await this.cartModel.findOne({ user: createCartDto.user });
    if (!cart) {
      const newCart = await this.cartModel.create({
        user: createCartDto.user,
        items: [createCartDto.item],
        tax: createCartDto.tax,
        totalPrice: createCartDto.totalPrice
      });

      return {
        status: 201,
        message: `Product added successfully to your cart`,
        data: newCart
      }
    }
    // adding tax & total price
    cart.tax += createCartDto.tax;
    cart.totalPrice += createCartDto.totalPrice;

    let productFound: boolean = false;
    cart.items.forEach((item) => {
      // console.log(item.product, createCartDto.item.product);
      
      if (item.product.toString() === createCartDto.item.product && item.color === createCartDto.item.color) {
        productFound = true;
        item.quantity += createCartDto.item.quantity;
        item.priceAtAddTime += createCartDto.item.priceAtAddTime;
        item.discountAtAddTime += createCartDto.item.discountAtAddTime;
        item.totalItemPrice += createCartDto.item.totalItemPrice;
      }
    });

    if (!productFound) {
      if(cart.items.length === 5) {
        throw new BadRequestException(`your cart is full.`)
      }
      cart.items.push(createCartDto.item);
    }

    await cart.save();

    return {
      status: 201,
      message: `Product added successfully to your cart`,
      data: cart
    }
  }

  async findAll(paginationDto: PaginationQueryDto) {
    const carts = await this.paginationService.paginateQuery<CartDocument, Cart>(paginationDto, this.cartModel);
    if(carts.data.length === 0) {
      throw new NotFoundException();
    }

    return carts;
  }

  async findOne(id: string, userId: string) {
    const cart = await this.cartModel.findById(id);
    if(!cart) {
      throw new NotFoundException();
    }

    const role: string = this.request['user']['role'];
    if(role === 'user' && userId !== cart.user.toString()) {
      throw new UnauthorizedException(`you are not allowed to view this cart`);
    }

    return {
      status: 200,
      message: 'cart found successfully',
      data: cart
    }
  }

  async update(updateCartDto: UpdateCartDto) {
    // will throw an error if user is not found
    const user = await this.userService.findOneById(updateCartDto.user);

    const cart = await this.cartModel.findOne({user: user._id});
    if(!cart) {
      throw new BadRequestException(`user with id: ${updateCartDto.user} doesn't have a cart`);
    }

    const index = cart.items.findIndex((item) => {
      if(item._id!.toString() === updateCartDto.item.item) {
        return true;
      }
    })

    if(index === -1) {
      throw new BadRequestException(`you don't have this product in your cart`)
    }

    const productId = cart.items[index].product.toString();

    // console.log(productId);
    
    await this.remove({userId: updateCartDto.user, itemId: updateCartDto.item.item});
    return await this.create({
      item: {
        product: productId,
        quantity: updateCartDto.item.quantity,
        color: updateCartDto.item.color,
        priceAtAddTime: 0,
        discountAtAddTime: 0,
        totalItemPrice: 0
      },
      user: updateCartDto.user,
      tax: 0,
      totalPrice: 0
    })
  }

  async remove(deleteProductFromCartDto: DeleteFromCartDto) {
    // will throw an error if user is not found
    const user = await this.userService.findOneById(deleteProductFromCartDto.userId);

    // will throw an error if there is no product
    // const product = (await this.productService.findOne(deleteProductFromCartDto.itemId)).date;

    const cart = await this.cartModel.findOne({user: user._id});
    if(!cart) {
      throw new BadRequestException(`user with id: ${deleteProductFromCartDto.userId} doesn't have a cart`);
    }

    const index = cart.items.findIndex((item) => {
      if(item._id!.toString() === deleteProductFromCartDto.itemId) {
        return true;
      }
    })
    
    if(index === -1) {
      throw new BadRequestException(`you don't have this item in your cart`)
    }

    // will throw an error if there is no tax;
    const tax = await this.taxService.findOne();

    const item = cart.items[index];

    cart.totalPrice -= item.totalItemPrice;
    cart.tax -= (tax.shippingTaxRate + tax.productTaxRate) * item.totalItemPrice 

    cart.items.splice(index, 1);

    
    
    await cart.save();

    return {
      status: 200,
      message: 'product deleted successfully'
    }
  }
}

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
import { ProductDocument } from 'src/product/schemas/product.schema ';
import { TaxDocument } from 'src/tax/schemas/tax-schema';

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

    const cart = await this.addToCart(user._id.toString(), product, createCartDto.item.quantity, createCartDto.item.color);

    return {
      status: 201,
      message: `Product added successfully to your cart`,
      data: cart
    }
  }

  async findAll(paginationDto: PaginationQueryDto) {
    const carts = await this.paginationService.paginateQuery<CartDocument, Cart>(paginationDto, this.cartModel);
    if (carts.data.length === 0) {
      throw new NotFoundException();
    }

    return carts;
  }

  async findOne(id: string, userId: string) {
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      throw new NotFoundException();
    }

    const role: string = this.request['user']['role'];
    if (role === 'user' && userId !== cart.user.toString()) {
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

    const { cart, productId } = await this.removeFromCart(updateCartDto.user, updateCartDto.item.item);

    const product = (await this.productService.findOne(productId)).date;

    const updatedCart = await this.addToCart(updateCartDto.user, product, updateCartDto.item.quantity, updateCartDto.item.color);

    return {
      status: 200,
      message: 'cart updated successfully',
      data: updatedCart
    }
  }

  async remove(deleteProductFromCartDto: DeleteFromCartDto) {
    // will throw an error if user is not found
    const user = await this.userService.findOneById(deleteProductFromCartDto.userId);
    
    await this.removeFromCart(deleteProductFromCartDto.userId, deleteProductFromCartDto.itemId);

    return {
      status: 200,
      message: 'product deleted successfully'
    }
  }

  async addToCart(userId: string, product: ProductDocument, quantity: number, color?: string) {

    if (color) {
      if (!product.color.includes(color)) {
        throw new BadRequestException(`there is no ${color} of product with id: ${product._id}.`)
      }
    }

    if (product.quantity < quantity) {
      throw new BadGatewayException(`the quantity you is not avilable at the moment, you can buy at most ${product.quantity}.`)
    }

    // will throw an error if there is no tax;
    const tax = await this.taxService.findOne();

    // get prices
    const prices = this.computePrices(product, quantity, tax);

    const createCartDto = {
      user: userId,
      item: {
        product: product._id.toString(),
        quantity: quantity,
        color: color,
        priceAtAddTime: prices.priceAtAddTime,
        discountAtAddTime: prices.discountAtAddTime,
        totalItemPrice: prices.totalItemPrice
      },
      tax: prices.taxes,
      totalPrice: prices.totalItemPrice
    }
    
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      const newCart = await this.cartModel.create({
        user: createCartDto.user,
        items: [createCartDto.item],
        tax: createCartDto.tax,
        totalPrice: createCartDto.totalPrice
      });

      return newCart;
    }

    // adding tax & total price
    cart.tax += createCartDto.tax;
    cart.totalPrice += createCartDto.totalPrice;

    let productFound: boolean = false;
    cart.items.forEach((item) => {
      if (item.product.toString() === createCartDto.item.product && item.color === createCartDto.item.color) {
        productFound = true;
        item.quantity += createCartDto.item.quantity;
        item.priceAtAddTime += createCartDto.item.priceAtAddTime;
        item.discountAtAddTime += createCartDto.item.discountAtAddTime;
        item.totalItemPrice += createCartDto.item.totalItemPrice;
      }
    });

    if (!productFound) {
      if (cart.items.length === 5) {
        throw new BadRequestException(`your cart is full.`)
      }
      cart.items.push(createCartDto.item);
    }

    await cart.save();

    return cart
  }

  computePrices(product: ProductDocument, quantity: number, tax: TaxDocument) {
    const priceAtAddTime = product.price * quantity;
    const discountAtAddTime = (
      product.discountPrice ? (product.price - product.discountPrice) * quantity : 0
    );

    // total quantity price
    const totalItemPrice = priceAtAddTime - discountAtAddTime

    // tax computation
    const taxes = (tax.shippingTaxRate + tax.productTaxRate) * totalItemPrice;

    return {
      priceAtAddTime,
      discountAtAddTime,
      totalItemPrice,
      taxes
    }
  }

  async removeFromCart(userId: string, itemId: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new BadRequestException(`user with id: ${userId} doesn't have a cart`);
    }

    const index = cart.items.findIndex((item) => {
      if (item._id!.toString() === itemId) {
        return true;
      }
    })

    if (index === -1) {
      throw new BadRequestException(`you don't have this item in your cart`)
    }

    const tax = await this.taxService.findOne();

    const item = cart.items[index];

    cart.items.splice(index, 1);

    cart.totalPrice -= item.totalItemPrice;
    cart.tax -= (tax.shippingTaxRate + tax.productTaxRate) * item.totalItemPrice

    await cart.save();

    return {
      cart,
      productId: item.product,
    }
  }
}

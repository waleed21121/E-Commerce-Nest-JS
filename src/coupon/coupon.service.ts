import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';
import { Model } from 'mongoose';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { CartDocument } from 'src/cart/schemas/cart-schema';
import { TaxDocument } from 'src/tax/schemas/tax-schema';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<CouponDocument>,
    private readonly paginationService: PaginationService,
  ) {

  }
  async create(createCouponDto: CreateCouponDto) {
    const coupon = await this.couponModel.create(createCouponDto);

    return {
      status: 200,
      message: 'coupon created successfully',
      data: coupon
    }
  }

  async findAll(paginationDto :PaginationQueryDto) {
    const coupons = await this.paginationService.paginateQuery<CouponDocument, Coupon>(paginationDto, this.couponModel);
        if(coupons.data.length === 0) {
          throw new NotFoundException();
        }
    
        return coupons;
  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findOne({_id: id})
    if(!coupon) {
      throw new NotFoundException(`coupon with given id: ${id} is not found`);
    }
    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponModel.findOneAndUpdate({_id: id}, updateCouponDto, {new: true})
    if(!coupon) {
      throw new NotFoundException(`coupon with given id: ${id} is not found`)
    }
    return coupon;
  }

  async remove(id: string) {
    return await this.couponModel.findOneAndDelete({_id: id});
  }

  async applyCoupon(cart: CartDocument, couponName: string, tax: TaxDocument) {
    const coupon = await this.couponModel.findOne({name: couponName});
    
    if(!coupon) {
      throw new NotFoundException(`coupon with name: ${couponName} not found`)
    }

    if(coupon.expiryDate < new Date()) {
      throw new BadRequestException(`expired coupon`);
    }

    if(cart.coupon.length === 3) {
      throw new BadRequestException(`you have applied 3 coupons`);
    }

    if(cart.totalPrice - coupon.discount < 0 || cart.coupon.includes({name: coupon.name, couponId: coupon._id.toString()})) {
      throw new BadRequestException(`this coupon is not applicable on your cart.`)
    }

    cart.totalPrice -= coupon.discount;
    cart.tax = (tax.shippingTaxRate + tax.productTaxRate) * cart.totalPrice;

    cart.coupon.push({
      couponId: coupon._id.toString(),
      name: coupon.name
    });

    await cart.save();

    return cart;
  }
}

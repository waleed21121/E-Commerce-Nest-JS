import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';
import { Model } from 'mongoose';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

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
}

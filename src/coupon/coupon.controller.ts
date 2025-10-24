import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { ParseMongoIdPipe } from 'src/pipes/mongo-id.pipe';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) { }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationQueryDto) {
    return this.couponService.findAll(paginationDto);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.couponService.findOne(id);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.couponService.remove(id);
  }
}

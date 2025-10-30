import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schemas/coupon.schema';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CouponController],
  providers: [CouponService],
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
    PaginationModule
  ],
  exports: [
    CouponService,
  ]
})
export class CouponModule { }

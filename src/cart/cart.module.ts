import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { ProductModule } from 'src/product/product.module';
import { Cart, CartSchema } from './schemas/cart-schema';
import { UserModule } from 'src/user/user.module';
import { TaxModule } from 'src/tax/tax.module';
import { CouponModule } from 'src/coupon/coupon.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    PaginationModule,
    ProductModule,
    UserModule,
    TaxModule,
    CouponModule,
  ],
  exports: [
    CartService
  ],
})
export class CartModule { }

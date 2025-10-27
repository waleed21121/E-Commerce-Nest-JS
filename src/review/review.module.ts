import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    PaginationModule,
    UserModule,
    ProductModule,
  ]
})
export class ReviewModule { }

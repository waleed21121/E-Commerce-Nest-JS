import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequestProductController } from './request-product.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import authConfig from 'src/config/auth.config';
import { RequestProduct, RequestProductSchema } from './schemas/request-product.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [RequestProductController],
  providers: [RequestProductService],
  imports: [
      ConfigModule.forFeature(authConfig),
      JwtModule.registerAsync(authConfig.asProvider()),
      MongooseModule.forFeature([{ name: RequestProduct.name, schema: RequestProductSchema }]),
      PaginationModule,
      UserModule
    ]
})
export class RequestProductModule {}

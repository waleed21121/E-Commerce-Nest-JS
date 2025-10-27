import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { UserModule } from 'src/user/user.module';
import { Product, ProductSchema } from './schemas/product.schema ';
import { SubCategoryModule } from 'src/sub-category/sub-category.module';
import { CategoryModule } from 'src/category/category.module';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    PaginationModule,
    SubCategoryModule,
    CategoryModule,
    BrandModule,
  ],
  exports: [
    ProductService,
  ]
})
export class ProductModule { }

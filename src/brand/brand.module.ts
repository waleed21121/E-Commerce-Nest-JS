import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    PaginationModule
  ],
  exports: [
    BrandService
  ]
})
export class BrandModule { }

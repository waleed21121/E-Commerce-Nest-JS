import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, SubCategorySchema } from './schemas/sub-category.schema';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema }]),
    PaginationModule,
    CategoryModule
  ],
  exports: [
    SubCategoryService,
  ]
})
export class SubCategoryModule { }

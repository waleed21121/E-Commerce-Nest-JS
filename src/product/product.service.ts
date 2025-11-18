import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument, ProductSchema } from './schemas/product.schema ';
import { Model } from 'mongoose';
import { SubCategoryService } from 'src/sub-category/sub-category.service';
import { CategoryService } from 'src/category/category.service';
import { BrandService } from 'src/brand/brand.service';
import { GetProductsDto } from './dto/get-products.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    private readonly subCategoryService: SubCategoryService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly paginationService: PaginationService
  ) {}
  async create(createProductDto: CreateProductDto) {
    if(createProductDto.brand) {
      // will throw an error if brand not found
      const brand = await this.brandService.findOne(createProductDto.brand);
    }

    if(createProductDto.category) {
      // will throw an exception if category not found
      const category = await this.categoryService.findOne(createProductDto.category)
    }

    if(createProductDto.subCategory) {
      const check = await this.subCategoryService.isChildCategory(createProductDto.subCategory, createProductDto.category);
      if(!check) {
        throw new BadRequestException(`sub-category with id: ${createProductDto.subCategory} is not a sub of category with id: ${createProductDto.category}`);
      }
    }
    
    const product = await this.productModel.create(createProductDto);

    return {
      success: 201,
      message: `product created successfully`,
      date: product
    }
  }

  async findAll(getProductsDto: GetProductsDto) {
    const {limit: limit, page: page} = getProductsDto;
    const paginationDto = {limit, page}
    const products = await this.paginationService.paginateQuery<ProductDocument, Product>(
      paginationDto,
      this.productModel,
      undefined,
      getProductsDto
    )

    if(products.data.length === 0) {
      throw new NotFoundException();
    }

    return products;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if(!product) {
      throw new NotFoundException();
    }

    return {
      success: 200,
      message: `product found successfully`,
      date: product
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    let product = await this.productModel.findById(id);
    if(!product) {
      throw new NotFoundException();
    }

    if(updateProductDto.brand) {
      // will throw an error if brand not found
      const brand = await this.brandService.findOne(updateProductDto.brand);
    }

    if(updateProductDto.category) {
      // will throw an exception if category not found
      const category = await this.categoryService.findOne(updateProductDto.category)
      const subCategoryId = updateProductDto.subCategory || product.subCategory;
      const check = await this.subCategoryService.isChildCategory(subCategoryId, updateProductDto.category);
      if(!check) {
        throw new BadRequestException(`sub-category with id: ${subCategoryId} is not a sub of category with id: ${updateProductDto.category}`);
      }
    }

    if(updateProductDto.subCategory) {
      const baseCategoryId = updateProductDto.category || product.category;
      const check = await this.subCategoryService.isChildCategory(updateProductDto.subCategory, baseCategoryId);
      if(!check) {
        throw new BadRequestException(`sub-category with id: ${updateProductDto.subCategory} is not a sub of category with id: ${baseCategoryId}`);
      }
    }

    let newProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, {new: true});
    
    return {
      success: 200,
      message: `product updated successfully`,
      date: newProduct
    }
  }

  async remove(id: string) {
    return await this.productModel.findByIdAndDelete(id);
  }

  async updatePoductRatings(product: ProductDocument, newRating: number, oldRating?: number, del?: boolean) {
    
    let previousAveragerating = product.averageRating;
    if(oldRating !== undefined) {
      previousAveragerating = (product.averageRating * product.reviewsCount - oldRating) / (product.reviewsCount - 1);
      product.reviewsCount -= 1;
    }
    
    let newAveragerating = previousAveragerating;
    if(!del) {
      newAveragerating = (previousAveragerating * product.reviewsCount + newRating) / (product.reviewsCount + 1);
      product.reviewsCount += 1;
    }

    await this.productModel.findByIdAndUpdate(product._id, {
      averageRating: newAveragerating,
      reviewsCount: product.reviewsCount
    });
  }

  async updateProductPurchases(id: string, qunatity: number) {
    let product = await this.productModel.findById(id);
    if(product) {
      product.quantity -= qunatity;
      product.purchases += qunatity;
      await product.save();
    }
  }
}

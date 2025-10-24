import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory, SubCategoryDocument } from './schemas/sub-category.schema';
import { Model } from 'mongoose';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategoryDocument>,
    private readonly paginationService: PaginationService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const existSubCategory = await this.subCategoryModel.findOne({name: createSubCategoryDto.name});
    if(existSubCategory) {
      throw new ConflictException('sub-category already exist');
    }

    // will throw an error if base category not found;
    const baseCategory = await this.categoryService.findOne(createSubCategoryDto.category);

    const subCategory = await this.subCategoryModel.create(createSubCategoryDto);

    return {
      status: 200,
      message: 'category created successfully',
      data: subCategory
    }
  }

  async findAll(paginationDto: PaginationQueryDto) {
    const subCategories = await this.paginationService.paginateQuery<SubCategoryDocument, SubCategory>(
      paginationDto,
      this.subCategoryModel,
      ['category']
    );
    if(subCategories.data.length === 0) {
      throw new NotFoundException();
    }

    return subCategories;
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryModel.findOne({_id: id})
    if(!subCategory) {
      throw new NotFoundException(`sub-category with given id: ${id} is not found`);
    }
    return subCategory;
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findOneAndUpdate({_id: id}, updateSubCategoryDto, {new: true})
    if(!subCategory) {
      throw new NotFoundException(`sub-category with given id: ${id} is not found`)
    }
    return subCategory;
  }

  async remove(id: string) {
    return await this.subCategoryModel.findOneAndDelete({_id: id})
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existCategory = await this.categoryModel.findOne({name: createCategoryDto.name});
    if(existCategory) {
      throw new ConflictException('category already exist');
    }

    const category = await this.categoryModel.create(createCategoryDto);

    return {
      status: 200,
      message: 'category created successfully',
      data: category
    }
  }

  async findAll(paginationDto: PaginationQueryDto) {
    const categories = await this.paginationService.paginateQuery<CategoryDocument>(paginationDto, this.categoryModel);
    if(categories.data.length === 0) {
      throw new NotFoundException();
    }

    return categories;
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findOne({_id: id})
    if(!category) {
      throw new NotFoundException(`category with given id: ${id} is not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findOneAndUpdate({_id: id}, updateCategoryDto, {new: true})
    if(!category) {
      throw new NotFoundException(`category with given id: ${id} is not found`)
    }
    return category;
  }

  async remove(id: string) {
    return await this.categoryModel.findOneAndDelete({_id: id})
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { Model } from 'mongoose';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    private readonly paginationService: PaginationService,
  ) {

  }
  async create(createBrandDto: CreateBrandDto) {
    const existBrand = await this.brandModel.findOne({ name: createBrandDto.name });
    if (existBrand) {
      throw new ConflictException('brand already exist');
    }

    const brand = await this.brandModel.create(createBrandDto);

    return {
      status: 200,
      message: 'brand created successfully',
      data: brand
    }
  }

  async findAll(paginationDto :PaginationQueryDto) {
    const brands = await this.paginationService.paginateQuery<BrandDocument, Brand>(paginationDto, this.brandModel);
        if(brands.data.length === 0) {
          throw new NotFoundException();
        }
    
        return brands;
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findOne({_id: id})
    if(!brand) {
      throw new NotFoundException(`brand with given id: ${id} is not found`);
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandModel.findOneAndUpdate({_id: id}, updateBrandDto, {new: true})
    if(!brand) {
      throw new NotFoundException(`brand with given id: ${id} is not found`)
    }
    return brand;
  }

  async remove(id: string) {
    return await this.brandModel.findOneAndDelete({_id: id});
  }
}

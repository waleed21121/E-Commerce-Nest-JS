import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RequestProduct, RequestProductDocument } from './schemas/request-product.schema';
import { FilterQuery, Model } from 'mongoose';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProduct.name) private readonly requestProductModel: Model<RequestProductDocument>,
    private readonly paginationService: PaginationService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async create(createRequestProductDto: CreateRequestProductDto) {
    const existRequestProduct = await this.requestProductModel.findOne({
      title: createRequestProductDto.title,
      user: createRequestProductDto.user
    });
    if (existRequestProduct) {
      throw new BadRequestException(`product with the given title: ${createRequestProductDto.title} already exist`)
    }

    const requestProduct = await this.requestProductModel.create(createRequestProductDto);

    return {
      status: 201,
      message: `request product created successfully`,
      data: requestProduct
    }
  }

  async findAll(paginationDto: PaginationQueryDto) {
    const requestProducts = await this.paginationService.paginateQuery<RequestProductDocument, RequestProduct>(
      paginationDto,
      this.requestProductModel,
      ['user']
    );
    if (requestProducts.data.length === 0) {
      throw new NotFoundException();
    }

    return requestProducts;
  }

  async findOne(id: string) {
    const role: string = this.request['user']['role'];
    let whereOptions: FilterQuery<RequestProductDocument> = {
      _id: id
    }
    if (role === 'user') {
      whereOptions.user = this.request['user']['sub']
    }

    const requestProduct = await this.requestProductModel.findOne(whereOptions).populate('user');
    if (!requestProduct) {
      throw new UnauthorizedException();
    }

    return requestProduct;
  }

  async update(id: string, updateRequestProductDto: UpdateRequestProductDto) {
    const newRequestProduct = await this.requestProductModel.findOneAndUpdate({
      _id: id,
      user: updateRequestProductDto.user
    },
      updateRequestProductDto, {
      new: true
    });

    if (!newRequestProduct) {
      throw new UnauthorizedException();
    }

    return newRequestProduct;
  }

  async remove(id: string) {
    const userId = this.request['user']['sub']
    const requestProduct = await this.requestProductModel.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!requestProduct) {
      throw new UnauthorizedException();
    }

    return requestProduct;
  }
}

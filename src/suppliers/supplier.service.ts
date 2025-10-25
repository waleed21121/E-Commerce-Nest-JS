import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier, SupplierDocument } from './schemas/supplier.schema';
import { Model } from 'mongoose';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private readonly supplierModel: Model<SupplierDocument>,
    private readonly paginationService: PaginationService,
  ) {

  }
  async create(createSupplierDto: CreateSupplierDto) {
    const existSupplier = await this.supplierModel.findOne({name: createSupplierDto.name});
    if(existSupplier) {
      throw new BadRequestException(`supplier with the name: ${createSupplierDto.name} already exist`)
    }

    const supplier = await this.supplierModel.create(createSupplierDto);

    return {
      status: 200,
      message: 'supplier created successfully',
      data: supplier
    }
  }

  async findAll(paginationDto :PaginationQueryDto) {
    const suppliers = await this.paginationService.paginateQuery<SupplierDocument, Supplier>(paginationDto, this.supplierModel);
        if(suppliers.data.length === 0) {
          throw new NotFoundException();
        }
    
        return suppliers;
  }

  async findOne(id: string) {
    const supplier = await this.supplierModel.findOne({_id: id})
    if(!supplier) {
      throw new NotFoundException(`supplier with given id: ${id} is not found`);
    }
    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierModel.findOneAndUpdate({_id: id}, updateSupplierDto, {new: true})
    if(!supplier) {
      throw new NotFoundException(`supplier with given id: ${id} is not found`)
    }
    return supplier;
  }

  async remove(id: string) {
    return await this.supplierModel.findOneAndDelete({_id: id});
  }
}

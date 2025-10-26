import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tax, TaxDocument } from './schemas/tax-schema';
import { Model } from 'mongoose';

@Injectable()
export class TaxService {
  constructor(
    @InjectModel(Tax.name) private readonly taxModel: Model<TaxDocument>
  ) { }

  async create(createTaxDto: CreateTaxDto) {
    let existTax = await this.taxModel.findOne({});
    if (existTax) {
      existTax.productTaxRate = createTaxDto.productTaxRate;
      existTax.shippingTaxRate = createTaxDto.shippingTaxRate;
      await existTax.save();
      return {
        status: 200,
        message: `tax updated successfully`,
        data: existTax
      };
    }

    const tax = await this.taxModel.create(createTaxDto);
    return {
      status: 200,
      message: `tax created successfully`,
      data: tax
    };
  }

  async findOne() {
    const tax = await this.taxModel.findOne({});
    if(!tax) {
      throw new NotFoundException();
    }

    return tax
  }
}

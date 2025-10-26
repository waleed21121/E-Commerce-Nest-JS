import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('taxes')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTaxDto: CreateTaxDto) {
    return this.taxService.create(createTaxDto);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get()
  findOne() {
    return this.taxService.findOne();
  }
}

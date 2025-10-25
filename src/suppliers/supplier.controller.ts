import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { ParseMongoIdPipe } from 'src/pipes/mongo-id.pipe';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCouponDto: CreateSupplierDto) {
    return this.supplierService.create(createCouponDto);
  }

  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationQueryDto) {
    return this.supplierService.findAll(paginationDto);
  }

  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.supplierService.findOne(id);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateCouponDto: UpdateSupplierDto) {
    return this.supplierService.update(id, updateCouponDto);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.supplierService.remove(id);
  }
}

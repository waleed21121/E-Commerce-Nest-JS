import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ParseMongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { GetProductsDto } from './dto/get-products.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() getProductsDto: GetProductsDto) {
    return this.productService.findAll(getProductsDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.productService.remove(id);
  }
}

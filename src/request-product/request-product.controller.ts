import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ActiveUser } from 'src/decorators/active-user.decorator';
import { ParseMongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Controller('request-products')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRequestProductDto: CreateRequestProductDto, @ActiveUser('sub', ParseMongoIdPipe) userId: string) {
    createRequestProductDto.user = userId;
    return this.requestProductService.create(createRequestProductDto);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.requestProductService.findAll(paginationQueryDto);
  }

  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.requestProductService.findOne(id);
  }

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
    @ActiveUser('sub', ParseMongoIdPipe) userId: string
  ) {
    updateRequestProductDto.user = userId;
    return this.requestProductService.update(id, updateRequestProductDto);
  }

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.requestProductService.remove(id);
  }
}

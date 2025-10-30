import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ActiveUser } from 'src/decorators/active-user.decorator';
import { ParseMongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { DeleteFromCartDto } from './dto/delete-from-cart.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  // User add a product to their cart.
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCartDto: CreateCartDto, @ActiveUser('sub', ParseMongoIdPipe) userId: string) {
    createCartDto.user = userId;
    return this.cartService.create(createCartDto);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationQueryDto) {
    return this.cartService.findAll(paginationDto);
  }

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post('/apply-coupon')
  applyCoupon(
    @Body() applyCouponDto: ApplyCouponDto,
    @ActiveUser('sub', ParseMongoIdPipe) userId: string
  ) {
    applyCouponDto.userId = userId;
    return this.cartService.applyCoupon(applyCouponDto)
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @ActiveUser('sub', ParseMongoIdPipe) userId: string) {
    return this.cartService.findOne(id, userId);
  }

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Patch()
  update(
    @Body() updateCartDto: UpdateCartDto,
    @ActiveUser('sub', ParseMongoIdPipe) userId: string
  ) {
    updateCartDto.user = userId
    return this.cartService.update(updateCartDto);
  }

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Delete()
  remove(
    @Body() deleteProductFromCartDto: DeleteFromCartDto,
    @ActiveUser('sub', ParseMongoIdPipe) userId: string
  ) {
    deleteProductFromCartDto.userId = userId;
    return this.cartService.remove(deleteProductFromCartDto);
  }
}

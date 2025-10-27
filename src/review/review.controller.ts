import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { ParseMongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { ActiveUser } from 'src/decorators/active-user.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @ActiveUser('sub', ParseMongoIdPipe) userId: string) {
    createReviewDto.user = userId
    return this.reviewService.create(createReviewDto);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationQueryDto) {
    return this.reviewService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reviewService.findOne(id);
  }

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @ActiveUser('sub', ParseMongoIdPipe) userId: string
  ) {
    return this.reviewService.update(id, updateReviewDto, userId);
  }

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @ActiveUser('sub', ParseMongoIdPipe) userId: string) {
    return this.reviewService.remove(id, userId);
  }
}

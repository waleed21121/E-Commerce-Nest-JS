import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Model } from 'mongoose';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    // will throw an error if user not found
    const user = await this.userService.findOneById(createReviewDto.user);

    // will throw an error if product not found
    const product = (await this.productService.findOne(createReviewDto.product)).date;
    
    const existReview = await this.reviewModel.findOne({
      product: createReviewDto.product,
      user: createReviewDto.user,
    })
    if(existReview) {
      throw new ConflictException('you have reviewed this product before');
    }

    const review = await this.reviewModel.create(createReviewDto);

    await this.productService.updatePoductRatings(product, createReviewDto.rating);

    return {
      status: 201,
      message: `review created successfully`,
      data: review
    }
  }

  async findAll(paginationDto: PaginationQueryDto) {
    const reviews = await this.paginationService.paginateQuery<ReviewDocument, Review>(paginationDto, this.reviewModel);
    if(reviews.data.length === 0) {
      throw new NotFoundException();
    }

    return reviews;
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findOne({_id: id})
                              .populate('user', '_id name email')
                              .populate('product', '-__v')
    if(!review) {
      throw new NotFoundException(`review with the given id: ${id} is not found`);
    }

    return {
      status: 200,
      message: `review found successfully`,
      data: review
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string) {
    const review = await this.reviewModel.findOne({_id: id});
    if(!review) {
      throw new NotFoundException(`review with the given id: ${id} is not found`);
    }

    const product = (await this.productService.findOne(review.product)).date;

    if(userId !== review.user) {
      throw new UnauthorizedException(`you are not authorized to update this review`)
    }

    const updatedReview = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, {new: true});

    if(updateReviewDto.rating) {
      await this.productService.updatePoductRatings(product, updateReviewDto.rating, review.rating)
    }
    return {
      status: 200,
      message: `review updated successfully`,
      data: updatedReview
    }
  }

  async remove(id: string, userId: string) {
    const review = await this.reviewModel.findOne({_id: id});
    
    if(!review) {
      throw new NotFoundException(`review with the given id: ${id} is not found`);
    }

    if(userId !== review.user) {
      throw new UnauthorizedException(`you are not authorized to delete this review`)
    }

    const product = (await this.productService.findOne(review.product)).date

    await this.productService.updatePoductRatings(product, 0, review.rating, true);
    
    return await this.reviewModel.findByIdAndDelete(id);
  }
}

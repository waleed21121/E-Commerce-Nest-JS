import { IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { CreateProductDto } from "./create-product.dto";
import { IntersectionType } from "@nestjs/mapped-types";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

[
    'brand',
    'averageRating',
    'category',
    'price',
    'purchases'
]

class ProductFiltersQuery {
    @IsMongoId()
    @IsOptional()
    brand?: string;

    @IsMongoId()
    @IsOptional()
    category?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    averageRating_gte?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    averageRating_lte?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    price_gte?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    price_lte?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    purchases_gte?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    purchases_lte?: number;

    @IsOptional()
    @IsString()
    sort: string;
}

export class GetProductsDto extends IntersectionType(
    ProductFiltersQuery,
    PaginationQueryDto
) {}
import {
    IsString,
    IsNotEmpty,
    MinLength,
    IsOptional,
    IsArray,
    IsMongoId,
    IsNumber,
    Min,
    Max,
    IsUrl,
    IsEmpty,
} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    description: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    color?: string[];

    @IsMongoId()
    @IsOptional()
    brand?: string;

    @IsMongoId()
    @IsNotEmpty()
    category: string;

    @IsMongoId()
    @IsOptional()
    subCategory?: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];

    // Pricing
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    discountPrice?: number;

    // Inventory
    @IsNumber()
    @Min(0)
    @IsOptional()
    quantity: number = 0;

    @IsNumber()
    @Min(0)
    @IsOptional()
    minStockAlert: number = 5;

    // Media
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    thumbnail: string;

    @IsArray()
    @IsOptional()
    @IsUrl({}, {each: true})
    images?: string[];

    // Analytics (auto-managed)
    @IsOptional()
    @IsNumber()
    @Min(0)
    views: number = 0;

    @IsOptional()
    @IsNumber()
    @Min(0)
    purchases: number = 0;

    // Ratings (auto-calculated)
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    averageRating: number = 0;

    @IsOptional()
    @IsNumber()
    @Min(0)
    reviewsCount: number = 0;
}

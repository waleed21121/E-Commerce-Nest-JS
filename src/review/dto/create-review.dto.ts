import { IsMongoId, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @IsMongoId()
    @IsNotEmpty()
    user: string;

    @IsMongoId()
    @IsNotEmpty()
    product: string;

    @Min(0)
    @Max(5)
    @IsNotEmpty()
    rating: number;

    @IsOptional()
    @IsString()
    comment?: string;
}


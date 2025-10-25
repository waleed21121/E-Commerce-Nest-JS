import { IsEmpty, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateRequestProductDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    details: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;

    @IsOptional()
    @IsString()
    @MinLength(5)
    category?: string;

    @IsEmpty()
    user: string;
}

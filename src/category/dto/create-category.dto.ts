import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(25, { message: 'Name must be at most 25 characters' })
    name: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    image: string
}

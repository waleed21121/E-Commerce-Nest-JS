import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsUrl } from "class-validator";

export class CreateBrandDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(100, { message: 'Name must be at most 25 characters' })
    name: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    image: string
}

import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsUrl, IsDate, Min, MinDate, IsNumber } from "class-validator";

export class CreateSupplierDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(100, { message: 'Name must be at most 25 characters' })
    name: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    website: string;
}

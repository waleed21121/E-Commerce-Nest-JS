import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsUrl, IsDate, Min, MinDate, IsNumber } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(100, { message: 'Name must be at most 25 characters' })
    name: string;

    @IsNotEmpty()
    @IsDate()
    @MinDate(new Date())
    expiryDate: Date;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    discount: number;
}

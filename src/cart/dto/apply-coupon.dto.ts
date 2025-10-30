import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class ApplyCouponDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: string;

    @IsNotEmpty()
    @IsString()
    couponName: string;
}
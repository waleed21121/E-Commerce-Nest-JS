import { Type } from 'class-transformer';
import {
    IsArray,
    IsEmpty,
    IsInt,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    Min,
    ValidateNested,
} from 'class-validator';

class CartItemDto {
    @IsNotEmpty()
    @IsMongoId()
    product: string;

    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @Min(1)
    quantity: number;

    @IsOptional()
    color?: string;

    @IsEmpty()
    priceAtAddTime: number;

    @IsEmpty()
    discountAtAddTime: number;

    @IsEmpty()
    totalItemPrice: number;
}

export class CreateCartDto {
    @IsNotEmpty()
    @IsMongoId()
    user: string;

    @IsObject()
    @ValidateNested()
    item: CartItemDto;

    @IsEmpty()
    tax: number;

    @IsEmpty()
    totalPrice: number;
}

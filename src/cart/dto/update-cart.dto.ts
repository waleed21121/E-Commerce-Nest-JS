import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNotEmpty, IsMongoId, IsNumber, IsInt, Min, IsOptional, IsEmpty, IsObject, ValidateNested } from 'class-validator';

class CartItemDto {
    @IsNotEmpty()
    @IsMongoId()
    item: string;

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

export class UpdateCartDto {
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

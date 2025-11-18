import {
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
    ValidateNested,
} from 'class-validator';


class ShippingInfoDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    fullName: string;

    @IsNotEmpty()
    @IsPhoneNumber('EG')
    phone: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    region: string;

    @IsOptional()
    @IsString()
    postalCode?: string;
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsMongoId()
    user: string;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    shippingInfo: ShippingInfoDto;

    @IsOptional()
    @IsEnum(['COD', 'CARD'])
    paymentMethod: 'COD' | 'CARD' = 'COD';
}

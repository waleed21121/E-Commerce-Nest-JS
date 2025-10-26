import { IsNumber, IsOptional } from "class-validator";

export class CreateTaxDto {
    @IsOptional()
    @IsNumber()
    productTaxRate: number = 0.14;

    @IsOptional()
    @IsNumber()
    shippingTaxRate: number = 0.14;
}

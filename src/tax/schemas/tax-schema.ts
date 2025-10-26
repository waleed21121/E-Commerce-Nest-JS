
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';

@Schema({
    timestamps: true
})
export class Tax {
    @Prop({
        type: Number,
        default: 0.14,
        min: 0.0,
        max: 1.0
    })
    productTaxRate: number;

    @Prop({
        type: Number,
        default: 0.14,
        min: 0.0,
        max: 1.0
    })
    shippingTaxRate: number;

}

export type TaxDocument = HydratedDocument<Tax>;
export const TaxSchema = SchemaFactory.createForClass(Tax);
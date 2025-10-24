
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

@Schema({
    timestamps: true
})
export class Coupon {
    @Prop({
        required: true,
        type: String,
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [100, 'Name must be at most 100 characters'],
    })
    name: string;

    @Prop({
        type: Date,
        required: true,
        min: new Date()
    })
    expiryDate: Date;

    @Prop({
        type: Number,
        required: true,
        min: 0,
    })
    discount: number;
}

export type CouponDocument = HydratedDocument<Coupon>;
export const CouponSchema = SchemaFactory.createForClass(Coupon);
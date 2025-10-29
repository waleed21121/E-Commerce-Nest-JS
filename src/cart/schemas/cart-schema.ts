import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Mongoose } from 'mongoose';
import { Coupon } from 'src/coupon/schemas/coupon.schema';
import { Product } from 'src/product/schemas/product.schema ';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Cart {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: true,
        unique: true,
    })
    user: string;

    @Prop({
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: Product.name,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                },
                color: {
                    type: String,
                },
                priceAtAddTime: {
                    type: Number,
                    required: true,
                },
                discountAtAddTime: {
                    type: Number,
                    default: 0,
                },
                totalItemPrice: {
                    type: Number,
                    required: true,
                },
            },
        ],
        required: true
    })
    items: {
        product: string;
        quantity: number;
        color?: string;
        priceAtAddTime: number;
        discountAtAddTime: number;
        totalItemPrice: number;
        _id?: string;
    }[];

    @Prop({
        type: [{
            name: {
                type: String
            },
            couponId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: Coupon.name
            }
        }]
    })
    coupon: {
        name: string,
        couponId: string;
    }[];

    @Prop({
        type: Number,
        default: 0
    })
    tax: number;

    @Prop({
        type: Number,
        default: 0
    })
    totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
export type CartDocument = HydratedDocument<Cart>;
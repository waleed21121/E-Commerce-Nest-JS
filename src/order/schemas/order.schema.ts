import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema ';
import { User } from 'src/user/schemas/user.schema';


@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    user: string;

    @Prop([
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: Product.name, required: true },
            name: { type: String },
            color: { type: String },
            quantity: { type: Number, required: true, min: 1 },
            priceAtOrderTime: { type: Number, required: true },
            discountAtOrderTime: { type: Number, default: 0 },
            totalItemPrice: { type: Number, required: true },
        },
    ])
    items: {
        product: string;
        name: string;
        color?: string;
        quantity: number;
        priceAtOrderTime: number;
        discountAtOrderTime: number;
        totalItemPrice: number;
    }[];

    @Prop({
        type: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            region: { type: String, required: true },
            postalCode: { type: String },
        },
        required: true,
    })
    shippingInfo: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        region: string;
        postalCode?: string;
    };

    @Prop({ type: Number, required: true })
    subtotal: number;

    @Prop({ type: Number, default: 0 })
    shippingFee: number;

    @Prop({ type: Number, default: 0 })
    tax: number;

    @Prop({ type: Number, required: true })
    totalPrice: number;

    @Prop({
        type: {
            method: { type: String, enum: ['COD', 'CARD'], default: 'COD' },
            status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
            paidAt: { type: Date },
        },
        default: { method: 'COD', status: 'pending' },
    })
    paymentInfo: {
        method: 'COD' | 'CARD';
        status: 'pending' | 'paid' | 'failed';
        paidAt?: Date;
    };

    @Prop({
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
        default: 'pending',
    })
    orderStatus: string;

    @Prop({ type: Date })
    deliveredAt?: Date;

}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);

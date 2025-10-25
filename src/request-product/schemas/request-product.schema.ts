
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema({
    timestamps: true
})
export class RequestProduct {
    @Prop({
        required: true,
        type: String,
        unique: true,
        minLength: 5,
    })
    title: string;

    @Prop({
        type: String,
        required: true,
        minLength: 5
    })
    details: string;

    @Prop({
        type: Number,
        required: true,
        min: 1
    })
    quantity: number;

    @Prop({
        type: String,
        minLength: 5
    })
    category: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name
    })
    user: string;
}

export type RequestProductDocument = HydratedDocument<RequestProduct>;
export const RequestProductSchema = SchemaFactory.createForClass(RequestProduct);
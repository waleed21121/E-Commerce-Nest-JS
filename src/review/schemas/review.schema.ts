import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema ';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Review {
    @Prop({ 
        type: Types.ObjectId,
        ref: User.name,
        required: true
    })
    user: string;

    @Prop({
        type: Types.ObjectId,
        ref: Product.name,
        required: true
    })
    product: string;

    @Prop({
        type: Number,
        required: true,
        min: 0,
        max: 5
    })
    rating: number;

    @Prop({
        type: String,
        trim: true
    })
    comment: string;
}

export type ReviewDocument = HydratedDocument<Review>;
export const ReviewSchema = SchemaFactory.createForClass(Review);

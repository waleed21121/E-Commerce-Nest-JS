
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

@Schema({
    timestamps: true
})
export class Brand {
    @Prop({
        required: true,
        type: String,
        unique: true,
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [100, 'Name must be at most 100 characters'],
    })
    name: string;

    @Prop({
        type: String
    })
    image: string;
}

export type BrandDocument = HydratedDocument<Brand>;
export const BrandSchema = SchemaFactory.createForClass(Brand);
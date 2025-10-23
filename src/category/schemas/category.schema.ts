
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

@Schema({
    timestamps: true
})
export class Category {
    @Prop({
        required: true,
        type: String,
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [25, 'Name must be at most 25 characters'],
    })
    name: string;

    @Prop({
        type: String
    })
    image: string;
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
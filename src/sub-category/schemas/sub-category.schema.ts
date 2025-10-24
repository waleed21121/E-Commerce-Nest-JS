
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';

@Schema({
    timestamps: true
})
export class SubCategory {
    @Prop({
        required: true,
        type: String,
        unique: true,
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [25, 'Name must be at most 25 characters'],
    })
    name: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Category.name
    })
    category: string;
}

export type SubCategoryDocument = HydratedDocument<SubCategory>;
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { Brand } from 'src/brand/schemas/brand.schema';
import { Category } from 'src/category/schemas/category.schema';
import { SubCategory } from 'src/sub-category/schemas/sub-category.schema';

@Schema({
    timestamps: true
})
export class Product {
    @Prop({
        required: true,
        type: String,
        minLength: 3
    })
    name: string;

    @Prop({
        required: true,
        type: String,
        minLength: 3
    })
    description: string;

    @Prop({
        type: [String]
    })
    color: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Brand.name
    })
    brand: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Category.name
    })
    category: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: SubCategory.name
    })
    subCategory: string;

    @Prop({
        type: [String]
    })
    tags: string[];

    // Pricing
    @Prop({
        required: true,
        type: Number,
        min: 0
    })
    price: number;

    @Prop({
        type: Number,
        min: 0
    })
    discountPrice: number;

    // Inventory
    @Prop({
        type: Number,
        default: 0,
        min: 0
    })
    quantity: number;

    @Prop({
        type: Number,
        default: 5,
        min: 0
    })
    minStockAlert: number;

    // Media
    @Prop({
        required: true,
        type: String
    })
    thumbnail: string;

    @Prop({
        type: [String],
    })
    images: string[];

    // Analytics
    @Prop({
        type: Number,
        default: 0,
        min: 0
    })
    views: number;

    @Prop({
        type: Number,
        default: 0,
        min: 0
    })
    purchases: number;

    @Prop({
        type: Number,
        default: 0,
        min: 0.0,
        max: 5.0
    })
    averageRating: number;

    @Prop({
        type: Number,
        default: 0,
        min: 0
    })
    reviewsCount: number;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

@Schema({
    timestamps: true
})
export class Supplier {
    @Prop({
        required: true,
        type: String,
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [100, 'Name must be at most 100 characters'],
        unique: true
    })
    name: string;

    @Prop({
        type: Schema,
        required: true,
    })
    website: string;
}

export type SupplierDocument = HydratedDocument<Supplier>;
export const SupplierSchema = SchemaFactory.createForClass(Supplier);
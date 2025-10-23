
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

@Schema({
    timestamps: true
})
export class User {
    @Prop({
        required: true,
        type: String,
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [25, 'Name must be at most 25 characters'],

    })
    name: string;

    @Prop({
        required: true,
        type: String,
        unique: true
    })
    email: string;

    @Prop({
        required: true,
        type: String,
        minLength: 8
    })
    password: string;

    @Prop({
        type: String,
        required: true,
        enum: ['user', 'admin']
    })
    role: string;

    @Prop({
        type: String
    })
    avatar: string;

    @Prop({
        type: Number
    })
    age: number;

    @Prop({
        type: String
    })
    PhoneNumber: string;

    @Prop({
        type: String
    })
    address: string;

    @Prop({
        type: Boolean,
        // required: true
    })
    active: boolean;

    @Prop({
        type: String,
    })
    verificationCode: string;

    @Prop({
        type: String,
        enum: ['male', 'female'],
        // required: true
    })
    gender: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
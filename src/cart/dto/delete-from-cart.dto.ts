import { IsMongoId, IsNotEmpty } from "class-validator";

export class DeleteFromCartDto {
    @IsNotEmpty()
    @IsMongoId()
    itemId: string;

    @IsNotEmpty()
    @IsMongoId()
    userId: string;
}
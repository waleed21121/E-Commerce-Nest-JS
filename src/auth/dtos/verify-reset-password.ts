import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class VerifyResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}
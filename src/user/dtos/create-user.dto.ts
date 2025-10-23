import { IsString, IsEmail, IsEnum, IsOptional, IsInt, IsBoolean, MinLength, MaxLength, IsPhoneNumber, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(25, { message: 'Name must be at most 25 characters' })
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;

    @IsOptional()
    @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
    role?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsInt()
    age?: number;

    @IsOptional()
    @IsString()
    @IsPhoneNumber('EG', {message: 'The phone number must begin with +20'})
    PhoneNumber?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsString()
    @Length(6, 6)
    verificationCode?: string;

    @IsOptional()
    @IsEnum(['male', 'female'], { message: 'Gender must be either male or female' })
    gender?: string;
}
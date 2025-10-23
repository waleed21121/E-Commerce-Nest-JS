import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import authConfig from '../config/auth.config';
import { SignupDto } from './dtos/signup.dto';
import { HashingProvider } from './providers/hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { UserDocument } from 'src/user/schemas/user.schema';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyResetPasswordDto } from './dtos/verify-reset-password';

@Injectable()
export class AuthService {
    private readonly userService: UserService;
    private readonly authConfiguration: ConfigType<typeof authConfig>;
    private readonly hashingProvider: HashingProvider;
    private readonly jwtService: JwtService;
    private readonly mailerService: MailerService;
    constructor(
        @Inject(forwardRef(() => UserService))
        userService: UserService,
        @Inject(authConfig.KEY) authConfiguration: ConfigType<typeof authConfig>,
        hashingProvider: HashingProvider,
        jwtService: JwtService,
        mailerService: MailerService
    ) {
        this.userService = userService;
        this.authConfiguration = authConfiguration;
        this.hashingProvider = hashingProvider;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }

    isAuth: boolean = false;

    async login(loginDto: LoginDto) {
        const user = await this.userService.findUserByEmail(loginDto.email);
        if (!user) {
            throw new NotFoundException(`User with the given email: ${loginDto.email} is not found`);
        }

        const comparison = await this.hashingProvider.compare(loginDto.password, user.password);
        if (!comparison) {
            throw new UnauthorizedException('Incorrect password')
        }

        const tokens = await this.genrateToken(user);

        return {
            data: user,
            success: true,
            message: 'User logged in successfully',
            accessToken: tokens.token,
            refreshToken: tokens.refreshToken
        }
    }

    private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync({
            sub: userId,
            ...payload
        }, {
            secret: this.authConfiguration.secret,
            expiresIn: expiresIn,
            // audience: this.authConfiguration.audience,
            // issuer: this.authConfiguration.issuer,
        })
    }

    async signup(signupDto: SignupDto) {
        signupDto.role = 'user';
        return await this.userService.createUser(signupDto);
    }

    private async genrateToken(user: UserDocument) {
        const accessToken = await this.signToken(user.id, this.authConfiguration.expiresIn, {
            id: user._id,
            role: user.role,
        })
        const refreshToken = await this.signToken(user.id, this.authConfiguration.refreshTokenExpiresIn, {
            id: user._id,
            role: user.role,
        })

        return {
            token: accessToken,
            refreshToken
        }
    }

    async sendResetCode(resetPasswordDto: ResetPasswordDto) {
        const user = await this.userService.findUserByEmail(resetPasswordDto.email);
        if (!user) {
            throw new NotFoundException(`User is not found`)
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
        user.verificationCode = code;
        await user.save();

        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Password Reset Code',
                text: `Your password reset code is ${code}. It expires in 10 minutes.`,
            })

            return {
                success: true,
                message: `email sent successfully to ${user.email}`
            }
        } catch (error) {
            throw new HttpException({
                success: false,
                message: `error sending email to ${user.email}`,
                error: error
            }, HttpStatus.UNRECOVERABLE_ERROR)
        }
    }

    async verifyResetPassword(verifyResetPasswordDto: VerifyResetPasswordDto) {
        const user = await this.userService.findUserByEmail(verifyResetPasswordDto.email);
        if (!user) throw new NotFoundException('User not found');

        if (user.verificationCode !== verifyResetPasswordDto.code) {
            throw new BadRequestException('Invalid or expired code');
        }

        const hashedPassword = await this.hashingProvider.hash(verifyResetPasswordDto.newPassword);
        user.password = hashedPassword;
        await user.save();

        return { message: 'Password reset successfully' };
    }
}

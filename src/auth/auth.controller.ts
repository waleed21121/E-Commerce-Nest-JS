import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerifyResetPasswordDto } from './dtos/verify-reset-password';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('signup')
  signup(@Body() userDto: SignupDto) {
    return this.authService.signup(userDto)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.sendResetCode(resetPasswordDto);
  }

  @Post('verify-reset-password')
  @HttpCode(HttpStatus.OK)
  verifyResetPassword(@Body() verifyResetPasswordDto: VerifyResetPasswordDto) {
    return this.authService.verifyResetPassword(verifyResetPasswordDto);
  }
}

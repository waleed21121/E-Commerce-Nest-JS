import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, {
      provide: HashingProvider,
      useClass: BcryptProvider
    }
  ],
  exports: [
    HashingProvider,
  ],
  imports: [
    ConfigModule.forFeature(authConfig),
    forwardRef(() => UserModule),
    JwtModule.registerAsync(authConfig.asProvider())
  ]
})
export class AuthModule {}

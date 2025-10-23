import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import authConfig from 'src/config/auth.config';
import { AuthModule } from 'src/auth/auth.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    forwardRef(() => AuthModule),
    PaginationModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}

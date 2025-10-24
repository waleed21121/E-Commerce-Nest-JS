import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from './config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { PaginationModule } from './common/pagination/pagination.module';
import mailerConfig from './config/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module'
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/e-commerc-nestjs'),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, mailerConfig]
    }),
    PaginationModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mailer.emailHost'),
          port: 587,
          secure: false,
          auth: {
            user: configService.get('mailer.senderEmail'),
            pass: configService.get('mailer.appPassword'),
          }
        }
      })
    }),
    CategoryModule,
    SubCategoryModule,
    BrandModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

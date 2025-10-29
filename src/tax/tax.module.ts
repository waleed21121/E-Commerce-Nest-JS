import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { Tax, TaxSchema } from './schemas/tax-schema';

@Module({
  controllers: [TaxController],
  providers: [TaxService],
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    MongooseModule.forFeature([{ name: Tax.name, schema: TaxSchema }]),
    PaginationModule
  ],
  exports: [
    TaxService,
  ]
})
export class TaxModule { }

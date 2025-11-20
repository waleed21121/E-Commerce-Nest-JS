import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { CloudinaryProvider } from './cloudinary-provider';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CloudinaryAsyncOptions } from "./interfaces/cloudinary-options";
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_PROVIDER } from "./constants";

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, CloudinaryProvider],
  exports: [FileUploadService],
})
export class FileUploadModule { }

import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024,
            message: 'image must be at most 1MB'
          }),
          new FileTypeValidator({
            fileType: /\/(jpg|jpeg|png)$/
          })
        ]
      })
    ) file: Express.Multer.File
  ) {
    return this.fileUploadService.uploadFileToCloudinary(file);
  }

}

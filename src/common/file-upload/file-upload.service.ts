import { Inject, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_PROVIDER } from './constants';
import { ICloudinaryOptions } from './interfaces/cloudinary-options';
import * as streamifier from 'streamifier';

@Injectable()
export class FileUploadService {
    
    constructor(
        @Inject(CLOUDINARY_PROVIDER) cloudinaryConfig: ICloudinaryOptions,
    ) {
        cloudinary.config({
            cloud_name: cloudinaryConfig.cloud_name,
            api_key: cloudinaryConfig.api_key,
            api_secret: cloudinaryConfig.api_secret,
        })
    }

    async uploadFileToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                (error, result: UploadApiResponse) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
}

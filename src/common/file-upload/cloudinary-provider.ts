import { ConfigModule, ConfigService } from "@nestjs/config";
import { CloudinaryAsyncOptions } from "./interfaces/cloudinary-options";
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_PROVIDER } from "./constants";

export const CloudinaryProvider: CloudinaryAsyncOptions = {
    provide: CLOUDINARY_PROVIDER,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (ConfigService: ConfigService) => {
        return {
            cloud_name: ConfigService.get('cloudinary.cloudName') || '',
            api_key: ConfigService.get('cloudinary.apiKey') || '',
            api_secret: ConfigService.get('cloudinary.apiSecret') || '',
        }
    }
}

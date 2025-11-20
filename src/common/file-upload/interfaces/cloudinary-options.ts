import { FactoryProvider, ModuleMetadata } from "@nestjs/common";
import { ConfigAndUrlOptions } from "cloudinary";

export interface ICloudinaryOptions {
    cloud_name: string,
    api_key: string,
    api_secret: string,
}

export type CloudinaryAsyncOptions = Pick<ModuleMetadata, 'imports'> &
    Pick<FactoryProvider<ICloudinaryOptions>, 'useFactory' | 'inject' | 'provide'>;

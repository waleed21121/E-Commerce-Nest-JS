import { FactoryProvider, ModuleMetadata } from "@nestjs/common";

export interface IStripeOptions {
    secretKey: string;
}

export type StripeAsyncOptions = Pick<ModuleMetadata, 'imports'> &
    Pick<FactoryProvider<IStripeOptions>, 'useFactory' | 'inject'>;

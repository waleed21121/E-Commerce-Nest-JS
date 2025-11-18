import { DynamicModule, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeAsyncOptions } from './interfaces/stripe_options.type';
import { STRIPE_OPTIONS } from './constants';

@Module({})
export class StripeModule {
    static forRootAsync(options: StripeAsyncOptions): DynamicModule{
        
        return {
            module: StripeModule,
            exports: [
                StripeService
            ],
            imports: options.imports,
            providers: [
                {
                    provide: STRIPE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject
                },
                StripeService
            ],
            global: true
        }
    }
}

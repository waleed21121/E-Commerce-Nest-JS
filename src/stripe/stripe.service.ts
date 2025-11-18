import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_OPTIONS } from './constants';
import Stripe from 'stripe';
import { IStripeOptions } from './interfaces/stripe_options.type';
import { Order } from 'src/order/schemas/order.schema';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe
    constructor(
        @Inject(STRIPE_OPTIONS) stripeOptions: IStripeOptions,
    ) {
        this.stripe = new Stripe(stripeOptions.secretKey);
    }

    async createCheckoutSession(order: Order) {
        let linteItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
        for (const item of order.items) {
            linteItems.push({
                price_data: {
                    currency: 'EGP',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: (item.priceAtOrderTime - item.discountAtOrderTime) * 100,
                },
                quantity: item.quantity,
            })
        }
        

        linteItems.push({
            price_data: {
                currency: 'EGP',
                product_data: {
                    name: 'Service Fees',
                },
                unit_amount: parseInt(((order.shippingFee + order.tax) * 100).toFixed(0))
            },
            quantity: 1
        })
        let session = await this.stripe.checkout.sessions.create({
            line_items: linteItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/url',
            cancel_url: 'http://localhost:3000/url',
            metadata: {
                userId: order.user
            }
        });

        const url = session.url;

        return url;
    }

    constructEvent(signature: string, secret: string, body: any) {
        const event = this.stripe.webhooks.constructEvent(body, signature, secret);
        return event;
    }
}

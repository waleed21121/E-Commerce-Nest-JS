import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, RawBodyRequest, Inject, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ActiveUser } from 'src/decorators/active-user.decorator';
import { ParseMongoIdPipe } from 'src/pipes/mongo-id.pipe';
import Stripe from 'stripe';
import { StripeService } from 'src/stripe/stripe.service';
import stripeConfig from 'src/config/stripe.config';
import { ConfigType } from '@nestjs/config';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly stripeService: StripeService,
    @Inject(stripeConfig.KEY) private readonly stripeConfiguration: ConfigType<typeof stripeConfig>,
  ) { }

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @ActiveUser('sub', ParseMongoIdPipe) userId: string,
  ) {
    createOrderDto.user = userId;
    return this.orderService.create(createOrderDto);
  }

  @Post('webhooks')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    
    const endpointSecret = this.stripeConfiguration.stripeWebhookSecret as string;
    let event: Stripe.Event;

    try {
      event = this.stripeService.constructEvent(
        sig,
        endpointSecret,
        req.rawBody,
      );
    } catch (err) {
      throw { error: `Webhook Error: ${err.message}` };
    }

    const session = event.data.object as Stripe.Checkout.Session;

    await this.orderService.handleSuccessfullPayment(session, event.type);
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @ActiveUser('sub') userId: string,
    @ActiveUser('role') role: string,
    @Query() paginateQueryDto: PaginationQueryDto,
  ) {
    return this.orderService.findAll(userId, role, paginateQueryDto);
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @ActiveUser('sub') userId: string,
    @ActiveUser('role') role: string,
  ) {
    return this.orderService.findOne(id, userId, role);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}

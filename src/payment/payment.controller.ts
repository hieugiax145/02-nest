import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from 'src/decorator/customize';
import { PaymentCheckDto } from './dto/payment-check.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post()
  async pay(@Body() createPaymentDto:CreatePaymentDto) {
    return await this.paymentService.pay(createPaymentDto);
  }

  @Public()
  @Post('check')
  async checkPayment(@Body() paymentCheckDto:PaymentCheckDto) {
    return await this.paymentService.checkPaymentStatus(paymentCheckDto);
  }

}

import { Injectable, Post } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PaymentCheckDto } from './dto/payment-check.dto';

@Injectable()
export class PaymentService {
  private readonly accessKey: string;
  private readonly secretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.accessKey = this.configService.get<string>('ACCESS_KEY');
    this.secretKey = this.configService.get<string>('SECRET_KEY');
  }

  async pay(createPaymentDto: CreatePaymentDto) {
    // const accessKey = this.configService.get<string>('ACCESS_KEY');
    // const secretKey = this.configService.get<string>('SECRET_KEY');
    const { amount } = createPaymentDto;

    const orderInfo = '3 con ngu';
    const partnerCode = 'MOMO';
    const redirectUrl =
      'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const requestType = 'payWithMethod';
    // const amount = '50000';
    const orderId = `${partnerCode}${Date.now()}`;
    const requestId = orderId;
    const extraData = '';
    const paymentCode =
      'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    const orderGroupId = '';
    const autoCapture = true;
    const orderExpireTime = 60;
    const lang = 'vi';

    // Create the raw signature
    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);

    // Generate the signature
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    // Create the request body
    const requestBody = {
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: +amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
      orderExpireTime: orderExpireTime,
    };

    try {
      console.log('Sending....');
      const response = await this.httpService.axiosRef.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(`Status: ${response.status}`);
      console.log('Body:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  async checkPaymentStatus(paymentCheckDto: PaymentCheckDto) {
    const { orderId } = paymentCheckDto;
    console.log(paymentCheckDto);
    const rawSignature = `accessKey=${this.accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'vi',
    };

    try {
      console.log('Sending....');
      const response = await this.httpService.axiosRef.post(
        'https://test-payment.momo.vn//v2/gateway/api/query',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(`Status: ${response.status}`);
      console.log('Body:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }
}

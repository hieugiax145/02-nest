import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService=app.get(ConfigService);
  const port=configService.get('PORT');
  app.setGlobalPrefix('api',{exclude:['']})
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  await app.listen(port??8080);
  
}
bootstrap();

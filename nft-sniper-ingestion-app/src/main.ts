import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { env } from './config/joi.schema';
import './sentry';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // prettier-ignore
    origin: [
      /http\:\/\/localhost/,
      /\.alphasniper\.xyz$/,
      'alphasniper.xyz',
      'www.alphasniper.xyz',
    ],
  });
  app.use(cookieParser(env.JWT_SECRET_KEY));
  await app.listen(3000);
}
bootstrap();

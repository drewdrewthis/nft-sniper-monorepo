import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { env } from './config/joi.schema';
import './sentry';
import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';

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
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });
  app.use(cookieParser(env.JWT_SECRET_KEY));
  await app.listen(3000);
}
bootstrap();

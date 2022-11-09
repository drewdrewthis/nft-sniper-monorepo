import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
  await app.listen(3000);
}
bootstrap();

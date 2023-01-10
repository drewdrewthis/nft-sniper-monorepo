import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './sentry';
import { enhanceApp } from './utils';

declare const module: any;

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
  enhanceApp(app);
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

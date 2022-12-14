import {
  INestApplication,
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { env } from '../config/joi.schema';

/**
 * Adds versioning and cookie parser
 * @param app INestApplication
 */
export function enhanceApp(app: INestApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(env.JWT_SECRET_KEY));
}

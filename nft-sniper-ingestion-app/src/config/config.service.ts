import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { env } from './joi.schema';
import { Configuration } from './configuration';

/**
 * Custom provider around the Nest Config Service
 */
@Injectable()
export class ConfigService extends NestConfigService<Configuration> {
  /**
   * Type safe environment variables with defined interface
   */
  get envVars() {
    return env;
  }
}

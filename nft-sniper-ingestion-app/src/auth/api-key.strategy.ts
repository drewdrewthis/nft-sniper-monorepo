import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private authService: AuthService) {
    super(
      { header: 'api-key', prefix: '' },
      true,
      async (apikey: string, done: any) => {
        if (this.authService.validateApiKey(apikey)) {
          done(null, true);
        }
        done(new UnauthorizedException(), null);
      },
    );
  }
}

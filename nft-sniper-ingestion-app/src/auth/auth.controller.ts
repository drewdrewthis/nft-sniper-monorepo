import { Body, Controller, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { ApiKeyAuthGuard } from './apikey-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { Response } from 'express';
import { ConfigService } from '../config/config.service';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configServie: ConfigService,
  ) {}

  @Public()
  @UseGuards(ApiKeyAuthGuard)
  @Post('discord-login')
  async apiKeyLogin(
    @Body() body: { discordId: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = this.configServie.getOrThrow('endpoints', {
      infer: true,
    });

    const { ACCESS_TOKEN_COOKIE_KEY, ACCESS_TOKEN_EXPIRATION_COOKIE_KEY } = jwt;

    try {
      const result = await this.authService.discordLogin(body);
      const expires = extractExpirationDateFromJWT(result.access_token);

      response.cookie(ACCESS_TOKEN_COOKIE_KEY, result.access_token, {
        httpOnly: true,
        secure: true,
        expires,
        signed: true,
      });

      response.cookie(ACCESS_TOKEN_EXPIRATION_COOKIE_KEY, expires.getTime(), {
        expires,
      });

      // TODO: only return the result.
      return {
        ...result,
        expires,
      };
    } catch (err) {
      this.logger.error(
        'Failed to login with discord id: ' + JSON.stringify(body),
      );

      throw err;
    }
  }
}

function extractExpirationDateFromJWT(token: string) {
  const base64Url = token.split('.')[1];
  const { exp } = JSON.parse(Buffer.from(base64Url, 'base64').toString());
  const seconds = Number(exp);
  return new Date(seconds * 1000);
}

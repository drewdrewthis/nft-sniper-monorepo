import {
  Controller,
  Get,
  Logger,
  Request,
  Post,
  UseGuards,
  Res,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/constants';
import { Response } from 'express';
import { ApiKeyAuthGuard } from './auth/apikey-auth.guard';

const ACCESS_TOKEN_COOKIE_KEY = 'alpha_sniper_access_token';
const ACCESS_TOKEN_EXPIRATION_COOKIE_KEY =
  'alpha_sniper_access_token_expiration';
const ACCESS_TOKEN_WALLET_ADDRESS_COOKIE_KEY = 'alpha_sniper_logged_in_address';

@Controller()
export class AppController {
  logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(req.user);
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

    response.cookie(
      ACCESS_TOKEN_WALLET_ADDRESS_COOKIE_KEY,
      req.user.walletAddress,
      {
        expires,
      },
    );

    return result;
  }

  @Public()
  @UseGuards(ApiKeyAuthGuard)
  @Post('auth/discord-login')
  async apiKeyLogin(
    @Body() body: any,
    @Res({ passthrough: true }) response: Response,
  ) {
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

    return {
      ...result,
      expires,
    };
  }

  @Post('auth/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE_KEY);
    response.clearCookie(ACCESS_TOKEN_EXPIRATION_COOKIE_KEY);
    response.clearCookie(ACCESS_TOKEN_WALLET_ADDRESS_COOKIE_KEY);
    return true;
  }

  @Public()
  @Post('auth/challenge')
  async createChallenge(@Request() req: any) {
    const nonce = await this.authService.getNonceForWallet(
      req.body.walletAddress,
    );

    return {
      nonce,
    };
  }
}

function extractExpirationDateFromJWT(token: string) {
  const base64Url = token.split('.')[1];
  const { exp } = JSON.parse(Buffer.from(base64Url, 'base64').toString());
  const seconds = Number(exp);
  return new Date(seconds * 1000);
}

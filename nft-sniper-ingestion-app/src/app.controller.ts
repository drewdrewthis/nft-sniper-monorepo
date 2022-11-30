import {
  Controller,
  Get,
  Logger,
  Request,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/constants';
import { Response } from 'express';

const ACCESS_TOKEN_COOKIE_KEY = 'alpha_sniper_access_token';
const LOGGED_IN_COOKIE_KEY = 'alpha_sniper_logged_in_address';

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
    response.cookie(ACCESS_TOKEN_COOKIE_KEY, result.access_token, {
      httpOnly: true,
      maxAge: 60 * 1000 * 60 * 24,
      secure: true,
      signed: true,
    });
    response.cookie(LOGGED_IN_COOKIE_KEY, req.user.walletAddress);
    return result;
  }

  @Post('auth/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE_KEY);
    response.clearCookie(LOGGED_IN_COOKIE_KEY);
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

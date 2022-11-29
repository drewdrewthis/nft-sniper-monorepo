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
    response.cookie('alpha_sniper_access_token', result.access_token, {
      httpOnly: true,
      maxAge: 60 * 1000 * 60 * 24,
      secure: true,
      signed: true,
    });
    return result;
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

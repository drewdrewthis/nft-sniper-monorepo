import {
  Controller,
  Get,
  Logger,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/constants';

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
  async login(@Request() req: any) {
    return this.authService.login(req.user);
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

import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

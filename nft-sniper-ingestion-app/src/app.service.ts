import { Injectable } from '@nestjs/common';
import { ResevoirService } from './apis/resevoir';
import { AlchemyService } from './apis/alchemy/alchemy.service';

@Injectable()
export class AppService {
  constructor(
    private readonly resevoirService: ResevoirService,
    private readonly alchemyService: AlchemyService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
}

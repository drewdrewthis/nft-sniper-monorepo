import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CrawlerServerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async run() {
    const url = this.configService.getOrThrow('CRAWLER_SERVER_CRAWL_ENDPOINT');
    await this.httpService.axiosRef.get(url);
  }
}

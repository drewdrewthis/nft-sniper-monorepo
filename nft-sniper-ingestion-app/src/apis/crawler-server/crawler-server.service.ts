import { Injectable } from '@nestjs/common';

@Injectable()
export class CrawlerServerService {
  async run() {
    await fetch('localhost:3000/crawl');
  }
}

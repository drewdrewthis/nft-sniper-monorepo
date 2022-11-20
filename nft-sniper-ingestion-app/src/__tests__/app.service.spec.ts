import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ResevoirService } from '../apis/resevoir';
import { AppService } from '../app.service';
import { AlchemyService } from '../apis/alchemy/alchemy.service';
import { CacheModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResevoirModule } from '../apis/resevoir/resevoir.module';
import { HttpRecordingService } from '../http-recording/http-recording.service';

describe('AppService', () => {
  let service: AppService;
  let httpRecordingService: HttpRecordingService;

  beforeAll(() => {
    httpRecordingService = new HttpRecordingService(__filename);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CacheModule.register(), ResevoirModule],
      providers: [AppService, ResevoirService, AlchemyService, ConfigService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterAll(() => {
    httpRecordingService.tearDown();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AlchemyModule } from '../apis/alchemy/alchemy.module';
import { AlchemyService } from '../apis/alchemy';
import { AppController } from '../app.controller';
import { AppModule } from '../app.module';
import { AppService } from '../app.service';
import { HttpModule } from '@nestjs/axios';
import { ResevoirModule } from '../apis/resevoir';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        AlchemyModule,
        AppModule,
        ResevoirModule,
        ConfigModule,
        AuthModule,
      ],
      controllers: [AppController],
      providers: [AppService, AlchemyService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

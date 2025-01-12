import { Module } from '@nestjs/common';

import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from './config/config.service';

import { ConfigModule } from './config/config.module';
import { TelegramService } from './services/telegram.service';

@Module({
  imports: [
    ConfigModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
  ],
  providers: [TelegramService],
})
export class AppModule {}

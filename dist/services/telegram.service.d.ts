import { Context, Telegraf } from 'telegraf';
import { ConfigService } from 'src/config/config.service';
export declare class TelegramService {
    private bot;
    private config;
    constructor(bot: Telegraf, config: ConfigService);
    start(ctx: Context): Promise<void>;
    onSearch(ctx: Context): Promise<string>;
    onPowerOn(ctx: Context): Promise<void>;
    onStart(ctx: Context): Promise<void>;
}

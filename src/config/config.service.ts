import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';
import { resolve } from 'node:path';
import { BehaviorSubject, filter, firstValueFrom, map } from 'rxjs';

// import { TELEGRAM_TOKEN } from 'src/config';

interface IConfig {
  /** Пользователи */
  users: number[];
  token: string;
  machines: { name: string; ip: string; mac: string }[];
  broadcast?: string[];
}

@Injectable()
export class ConfigService implements TelegrafOptionsFactory {
  constructor() {
    this.init();
  }

  public async createTelegrafOptions(): Promise<TelegrafModuleOptions> {
    return { token: await firstValueFrom(this.token$) };
  }

  private async init() {
    const configPath = resolve(process.cwd(), 'config.json');
    console.log('configPath=', configPath);
    const config = await fs.readJSON(configPath);
    console.log('config=', config);
    this.configSubject.next(config);
  }

  private configSubject = new BehaviorSubject<IConfig>(null);

  private config$ = this.configSubject.pipe(filter((c) => !!c));

  public users$ = this.config$.pipe(map((conf) => conf?.users ?? []));
  public token$ = this.config$.pipe(map((conf) => conf?.token));
  public machines$ = this.config$.pipe(map((conf) => conf?.machines));
}

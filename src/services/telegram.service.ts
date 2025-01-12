// import { Injectable } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';

import { Action, Ctx, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { ConfigService } from 'src/config/config.service';
import { firstValueFrom } from 'rxjs';
import { getTable } from '@network-utils/arp-lookup';
import { wake } from 'wake_on_lan';

@Update()
export class TelegramService {
  constructor(
    @InjectBot() private bot: Telegraf,
    private config: ConfigService,
  ) {
    bot.use(async (ctx, next) => {
      const users = await firstValueFrom(config.users$);
      if (!users.includes(ctx.from.id)) {
        return ctx.reply(
          `Привет, ${ctx.from.first_name} (${ctx.from.id}). Извини но запрос не авторизован`,
        );
      }
      return next(); // runs next middleware
    });
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    const keyboard = Markup.keyboard([
      [{ text: `🔍 поиск устройств в сети` }, { text: `🖥️ включение` }],
    ])
      .persistent()
      .resize();

    ctx.reply(
      [
        `Привет, ${ctx.message.from.first_name}. Кого я вижу! Вот твой айдишник ${ctx.message.from.id}. Вот что я могу`,
      ].join('\n'),
      keyboard,
    );
  }

  @Hears('🔍 поиск устройств в сети')
  async onSearch(@Ctx() ctx: Context) {
    const report = await getTable();

    ctx.reply('Вот такие устройства есть в сети');
    return report.map(({ ip, mac }) => `${ip} (${mac})`).join('\n');
    // return ctx.reply('regular');
  }

  @Hears('🖥️ включение')
  async onPowerOn(@Ctx() ctx: Context) {
    const machines = await firstValueFrom(this.config.machines$);

    ctx.reply(
      'Выбери устройство из списка',
      Markup.inlineKeyboard(
        machines.map(({ ip, name, mac }) => {
          return [
            { text: `${name} (${ip})`, callback_data: `poweron->${mac}` },
          ];
        }),
      ),
    );
  }

  @Action(/poweron->(.+)/)
  async onStart(@Ctx() ctx: Context) {
    console.log((ctx as any).match[1]);
    const actionMac = (ctx as any).match[1];

    const machines = await firstValueFrom(this.config.machines$);
    const machine = machines.find(({ mac }) => actionMac === mac);
    if (!machine) {
      ctx.reply(`Устройство с MAC ${actionMac} не найдено`);
    }

    ctx.reply(`Стартуем ${machine.name} ${machine.ip}...`);
    try {
      await wake(machine.mac, {
        address: machine.ip,
      });
      ctx.reply(`Команда выполнена`);
    } catch {
      ctx.reply(`Ошибка вызова`);
    }
  }
}

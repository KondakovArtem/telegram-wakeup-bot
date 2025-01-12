"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const telegraf_1 = require("telegraf");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const config_service_1 = require("../config/config.service");
const rxjs_1 = require("rxjs");
const arp_lookup_1 = require("@network-utils/arp-lookup");
const wake_on_lan_1 = require("wake_on_lan");
let TelegramService = class TelegramService {
    constructor(bot, config) {
        this.bot = bot;
        this.config = config;
        bot.use(async (ctx, next) => {
            const users = await (0, rxjs_1.firstValueFrom)(config.users$);
            if (!users.includes(ctx.from.id)) {
                return ctx.reply(`Привет, ${ctx.from.first_name} (${ctx.from.id}). Извини но запрос не авторизован`);
            }
            return next();
        });
    }
    async start(ctx) {
        const keyboard = telegraf_1.Markup.keyboard([
            [{ text: `🔍 поиск устройств в сети` }, { text: `🖥️ включение` }],
        ])
            .persistent()
            .resize();
        ctx.reply([
            `Привет, ${ctx.message.from.first_name}. Кого я вижу! Вот твой айдишник ${ctx.message.from.id}. Вот что я могу`,
        ].join('\n'), keyboard);
    }
    async onSearch(ctx) {
        const report = await (0, arp_lookup_1.getTable)();
        ctx.reply('Вот такие устройства есть в сети');
        return report.map(({ ip, mac }) => `${ip} (${mac})`).join('\n');
    }
    async onPowerOn(ctx) {
        const machines = await (0, rxjs_1.firstValueFrom)(this.config.machines$);
        ctx.reply('Выбери устройство из списка', telegraf_1.Markup.inlineKeyboard(machines.map(({ ip, name, mac }) => {
            return [
                { text: `${name} (${ip})`, callback_data: `poweron->${mac}` },
            ];
        })));
    }
    async onStart(ctx) {
        console.log(ctx.match[1]);
        const actionMac = ctx.match[1];
        const machines = await (0, rxjs_1.firstValueFrom)(this.config.machines$);
        const machine = machines.find(({ mac }) => actionMac === mac);
        if (!machine) {
            ctx.reply(`Устройство с MAC ${actionMac} не найдено`);
        }
        ctx.reply(`Стартуем ${machine.name} ${machine.ip}...`);
        try {
            await (0, wake_on_lan_1.wake)(machine.mac, {
                address: machine.ip,
            });
            ctx.reply(`Команда выполнена`);
        }
        catch {
            ctx.reply(`Ошибка вызова`);
        }
    }
};
exports.TelegramService = TelegramService;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramService.prototype, "start", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🔍 поиск устройств в сети'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramService.prototype, "onSearch", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🖥️ включение'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramService.prototype, "onPowerOn", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/poweron->(.+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramService.prototype, "onStart", null);
exports.TelegramService = TelegramService = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf,
        config_service_1.ConfigService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map
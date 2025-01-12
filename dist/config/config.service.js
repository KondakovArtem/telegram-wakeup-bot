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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs-extra");
const node_path_1 = require("node:path");
const rxjs_1 = require("rxjs");
let ConfigService = class ConfigService {
    constructor() {
        this.configSubject = new rxjs_1.BehaviorSubject(null);
        this.config$ = this.configSubject.pipe((0, rxjs_1.filter)((c) => !!c));
        this.users$ = this.config$.pipe((0, rxjs_1.map)((conf) => conf?.users ?? []));
        this.token$ = this.config$.pipe((0, rxjs_1.map)((conf) => conf?.token));
        this.machines$ = this.config$.pipe((0, rxjs_1.map)((conf) => conf?.machines));
        this.init();
    }
    async createTelegrafOptions() {
        return { token: await (0, rxjs_1.firstValueFrom)(this.token$) };
    }
    async init() {
        const configPath = (0, node_path_1.resolve)(process.cwd(), 'config.json');
        console.log('configPath=', configPath);
        const config = await fs.readJSON(configPath);
        console.log('config=', config);
        this.configSubject.next(config);
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ConfigService);
//# sourceMappingURL=config.service.js.map
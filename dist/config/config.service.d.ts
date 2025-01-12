import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';
export declare class ConfigService implements TelegrafOptionsFactory {
    constructor();
    createTelegrafOptions(): Promise<TelegrafModuleOptions>;
    private init;
    private configSubject;
    private config$;
    users$: import("rxjs").Observable<number[]>;
    token$: import("rxjs").Observable<string>;
    machines$: import("rxjs").Observable<{
        name: string;
        ip: string;
        mac: string;
    }[]>;
}

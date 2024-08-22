import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { customConfigLoader } from "./utils/custom_config_loader";
import { WecomModule } from "./wecom/wecom.module";
import { WecomController } from "./wecom/wecom.controller";
import { WecomService } from "./wecom/wecom.service";
import { HttpModule } from "@nestjs/axios";
import { CacheModule } from "@nestjs/cache-manager";

const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: envFilePath,
            load: [customConfigLoader],
        }),
        WecomModule,
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const proxyConfig = configService.get<boolean>('proxy.enable') ? {
                    host: configService.get<string>('proxy.host'),
                    port: configService.get<number>('proxy.port'),
                    auth: {
                        username: configService.get<string>('proxy.username'),
                        password: configService.get<string>('proxy.password'),
                    },
                } : false;
                return {
                    timeout: 5000,
                    // proxy: proxyConfig,
                };
            },
        }),
        CacheModule.register({
            isGlobal: true, // 设置为全局模块
        })
    ],
    controllers: [WecomController],
    providers: [WecomService],
})
export class AppModule { }

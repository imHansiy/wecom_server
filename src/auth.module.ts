import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { customConfigLoader } from './utils/custom_config_loader';
const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;
@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: envFilePath,
        load: [customConfigLoader], 
    })],
    controllers:[AuthController],
    providers: [AuthService],
})
export class AuthModule {}

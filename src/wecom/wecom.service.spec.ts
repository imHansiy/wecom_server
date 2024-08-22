import { Test } from "@nestjs/testing";
import { WecomService } from "./wecom.service";
import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { CacheModule } from "@nestjs/cache-manager";
const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;
describe('WecomService', () => {
    let service: WecomService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [HttpModule, CacheModule.register()],
            providers: [
                WecomService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation(key => {
                            switch (key) {
                                case "wecom.corpid":
                                    return "wwb330a036235c91ea";
                                case "wecom.corpsecret":
                                    return "d7VpIdwHW8vycxmZgziU6-aPPjjDfzIL-ipj1RRgiho";
                                case "wecom.baseUrl":
                                    return "https://qyapi.weixin.qq.com";
                                default:
                                    return "";
                            }
                        })
                    }
                }
            ],
        }).compile()
        service = module.get<WecomService>(WecomService);
    });

    test("测试获取企业微信AccessToken", async () => {
        const result = await service.getAccessToken();
        console.log('AccessToken:', result); // 输出实际的 access token
        expect(result).toBeDefined(); // 你可以根据你的预期调整这个断言
    })
});

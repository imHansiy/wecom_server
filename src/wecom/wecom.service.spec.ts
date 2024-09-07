import { Test } from "@nestjs/testing";
import { WecomService } from "./wecom.service";
import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { CacheModule } from "@nestjs/cache-manager";
import { getSignature } from "@wecom/crypto";
import { single } from "rxjs";
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

    test("测试签名", () => {
        const signStr = getSignature("vc9n1WcCL2p0A2jzFdzS", "1725331850", "1725238757", "3HLcwvpFKqcNupZLNqoLqHumErbHjVGmSRGqpFqUcUAbRV+FV9z/p2eyxWkHTOlkAXr57bR8wYYUNxO113OFCTLVAf9nTd6MOTKVLQng/6mrg8/9zzhz4I3T/VbhPFfE+Th551sbOUd1qPqMo3HpKR9QDe/chFLGyO/jsUKPzbkp/mpAsqxiev7MPIqdYTVprrMiz6WbiI+u4yKKgy1eiZeu7oExbMzz6RjgckL+agb8o+CAQE3Y1B7u157TxzwXaPNl0adUOTWhqirFvlN6DD90nSZTsU1Bb7o4SLMjjyUQYQiD7txwi5MyLNJWfXbanobykBb1MwLngHPmpP7UjdINppGwD4l0Y5Y+QyfuFp69unjltRfy8zUy3p8ckMiGUNkh60dbCW87pJinAgQKSC1z83wH3g5CeqNy9gN1acU=");
        console.log(signStr);
        const msgSignature = "cc3f9ef8d371c5d5cb7d1d1e2d394293f8ca3bf2"
        expect(signStr).toEqual(msgSignature)
    })
});

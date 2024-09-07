import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { WecomService } from "./wecom.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class WecomMessage {
    private url;
    private agentid;
    constructor(
        @Inject(forwardRef(() => WecomService))
        private readonly wecomServer: WecomService,
        private readonly configServer: ConfigService,
        private readonly httpService: HttpService,

    ) {
        this.agentid = this.configServer.get<string>("wecom.agentid")
    }

    async init() {
        this.url = `${this.configServer.get<string>("wecom.baseUrl")}/cgi-bin/message/send?access_token=${await this.wecomServer.getAccessToken()}`;
    }

    getByteLength(str: string): number {
        return new TextEncoder().encode(str).length;
    }

    sliceByByteLength(str: string, byteLimit: number): string {
        let byteLength = 0;
        let i = 0;
        for (i = 0; i < str.length; i++) {
            const char = str[i];
            const charByteLength = new TextEncoder().encode(char).length;
            if (byteLength + charByteLength > byteLimit) {
                break;
            }
            byteLength += charByteLength;
        }
        return str.slice(0, i);
    }

    async sendTextMsg(msg: string, touser = "@all"): Promise<void> {
        await this.init();

        const byteLimit = 2048;
        const msgTotalLength = this.getByteLength(msg);
        const totalSlices = Math.ceil(msgTotalLength / (byteLimit - 10)); // 留出大约10字节用于分片标识 "(X/Y)"

        const sendPart = async (msgPart: string, currentSlice: number): Promise<SendMsgResp> => {
            const sliceSuffix = ` (${currentSlice}/${totalSlices})`;
            const payload: SendMsgTextPayload = {
                "touser": touser,
                "msgtype": "text",
                "agentid": this.agentid,
                "text": {
                    "content": `${msgPart}${sliceSuffix}`
                }
            };

            try {
                const res = await this.httpService.post(this.url, payload).toPromise();
                const data: SendMsgResp = res.data;
                return data;
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        };

        let currentByteOffset = 0;
        for (let currentSlice = 1; currentSlice <= totalSlices; currentSlice++) {
            // 预留出 sliceSuffix 的字节空间
            const sliceSuffix = ` (${currentSlice}/${totalSlices})`;
            const sliceSuffixLength = this.getByteLength(sliceSuffix);
            const availableBytes = byteLimit - sliceSuffixLength;

            // 计算消息片段
            const msgPart = this.sliceByByteLength(msg.slice(currentByteOffset), availableBytes);
            currentByteOffset += msgPart.length;

            // 发送消息片段
            const resp = await sendPart(msgPart, currentSlice);

            if (resp.errcode !== 0) {
                console.error("Failed to send message:", resp.errmsg);
                // 如果发送失败，提前退出
                break;
            }

            // 如果还有更多片段需要发送，等待一秒
            if (currentSlice < totalSlices) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
}
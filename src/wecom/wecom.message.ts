import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { WecomService } from "./wecom.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { WecomMedia } from "./wecom.media";

/**
 * 消息发送结果类型
 */
type _SendMsgResult = {
    success: boolean;
    error?: {
        message: string;
        details?: any;
        phase?: 'upload' | 'send';
        failedAtSlice?: number;
    };
    messageIds?: string[];   // 分片消息的所有ID
    messageId?: string;      // 单条消息ID
    mediaId?: string;        // 媒体文件ID
};

@Injectable()
export class WecomMessage {
    private url: string;
    private readonly agentid: number;

    constructor(
        @Inject(forwardRef(() => WecomService))
        private readonly wecomServer: WecomService,
        private readonly configServer: ConfigService,
        private readonly httpService: HttpService,
        private readonly wecomMedia: WecomMedia
    ) {
        this.agentid = this.configServer.get<number>("wecom.agentid");
    }

    /**
     * 初始化消息发送URL
     */
    private async init(): Promise<void> {
        const baseUrl = this.configServer.get<string>("wecom.baseUrl");
        const token = await this.wecomServer.getAccessToken();
        this.url = `${baseUrl}/cgi-bin/message/send?access_token=${token}`;
    }

    /**
     * 计算字符串的字节长度
     */
    private getByteLength(str: string): number {
        return new TextEncoder().encode(str).length;
    }

    /**
     * 按字节长度切割字符串
     */
    private sliceByByteLength(str: string, byteLimit: number): string {
        const encoder = new TextEncoder();
        let byteLength = 0;
        let i = 0;

        for (i = 0; i < str.length; i++) {
            const charByteLength = encoder.encode(str[i]).length;
            if (byteLength + charByteLength > byteLimit) break;
            byteLength += charByteLength;
        }

        return str.slice(0, i);
    }

    /**
     * 发送基础消息
     * @param payload 消息负载
     * @returns 发送结果
     */
    private async sendMessage(payload: any): Promise<_SendMsgResult> {
        try {
            const res = await this.httpService.post(this.url, payload).toPromise();
            const data = res.data;

            if (data.errcode !== 0) {
                return {
                    success: false,
                    error: {
                        message: `发送失败: ${data.errmsg}`,
                        details: data,
                        phase: 'send'
                    }
                };
            }

            return {
                success: true,
                messageId: data.msgid
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: `发送请求失败: ${error.message}`,
                    phase: 'send'
                }
            };
        }
    }

    /**
     * 上传媒体文件
     * @param filePath 文件路径
     * @returns 上传结果
     */
    private async uploadMedia(filePath: string): Promise<_SendMsgResult> {
        try {
            const { data, success, error } = await this.wecomMedia.uploadMedia(filePath);

            if (!success) {
                return {
                    success: false,
                    error: {
                        message: `上传失败: ${error}`,
                        details: data,
                        phase: 'upload'
                    }
                };
            }

            return {
                success: true,
                mediaId: data.media_id
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: `上传请求失败: ${error.message}`,
                    phase: 'upload'
                }
            };
        }
    }

    /**
     * 发送文本消息
     * @param touser 接收人，默认@all
     * @param msg 消息内容
     * @returns 发送结果
     */
    async sendTextMsg(touser: string = "@all", msg: string): Promise<_SendMsgResult> {
        try {
            await this.init();
            const byteLimit = 2048;
            const msgTotalLength = this.getByteLength(msg);
            const totalSlices = Math.ceil(msgTotalLength / (byteLimit - 10));
            const messageIds: string[] = [];

            for (let currentSlice = 1; currentSlice <= totalSlices; currentSlice++) {
                const sliceSuffix = totalSlices > 1 ? ` (${currentSlice}/${totalSlices})` : '';
                const availableBytes = byteLimit - this.getByteLength(sliceSuffix);
                const msgPart = this.sliceByByteLength(msg, availableBytes);

                const result = await this.sendMessage({
                    touser,
                    msgtype: "text",
                    agentid: this.agentid,
                    text: { content: `${msgPart}${sliceSuffix}` }
                });

                if (!result.success) {
                    return {
                        ...result,
                        error: {
                            ...result.error,
                            failedAtSlice: currentSlice
                        }
                    };
                }

                if (result.messageId) {
                    messageIds.push(result.messageId);
                }

                if (currentSlice < totalSlices) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            return { success: true, messageIds };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: `发送文本消息异常: ${error.message}`
                }
            };
        }
    }

    /**
     * 发送媒体消息（图片/语音/视频）
     * @param type 媒体类型
     * @param touser 接收人，默认@all
     * @param mediaPath 媒体文件路径
     */
    private async sendMediaMsg(
        type: 'image' | 'voice' | 'video',
        touser: string = "@all",
        mediaPath?: string
    ): Promise<_SendMsgResult> {
        try {
            await this.init();

            if (!mediaPath) {
                return {
                    success: false,
                    error: {
                        message: `未提供${type}文件路径`,
                        phase: 'upload'
                    }
                };
            }

            const uploadResult = await this.uploadMedia(mediaPath);

            if (!uploadResult.success) return uploadResult;

            const payload = {
                touser,
                msgtype: type,
                agentid: this.agentid,
                [type]: {
                    media_id: uploadResult.mediaId
                }
            };

            const sendResult = await this.sendMessage(payload);
            return {
                ...sendResult,
                mediaId: uploadResult.mediaId
            };

        } catch (error) {
            return {
                success: false,
                error: {
                    message: `发送${type}消息异常: ${error.message}`
                }
            };
        }
    }

    /**
     * 发送图片消息
     */
    async sendImageMsg(touser: string = "@all", img?: string): Promise<_SendMsgResult> {
        return this.sendMediaMsg('image', touser, img);
    }

    /**
     * 发送语音消息
     */
    async sendVoiceMsg(touser: string = "@all", voice?: string): Promise<_SendMsgResult> {
        return this.sendMediaMsg('voice', touser, voice);
    }

    /**
     * 发送视频消息
     */
    async sendVideoMsg(touser: string = "@all", video?: string): Promise<_SendMsgResult> {
        return this.sendMediaMsg('video', touser, video);
    }
}
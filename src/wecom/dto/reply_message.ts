/**
 * 基础消息类
 */
abstract class WecomReplyBaseMessage {
    protected msgType: string;
    protected toUserName: string;
    protected fromUserName: string;

    constructor({ msgType, toUserName, fromUserName }: { msgType: string, toUserName: string, fromUserName: string }) {
        this.toUserName = toUserName;
        this.fromUserName = fromUserName;
        this.msgType = msgType;
    }

    protected abstract toXmlBody(): string;

    public toXml(): string {
        const body = this.toXmlBody();
        return `
<xml>
    <ToUserName><![CDATA[${this.toUserName}]]></ToUserName>
    <FromUserName><![CDATA[${this.fromUserName}]]></FromUserName>
    <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
    <MsgType><![CDATA[${this.msgType}]]></MsgType>
    ${body}
</xml>
        `.trim();
    }
}

/**
 * 文本消息类
 */
export class WecomReplyTextMessage extends WecomReplyBaseMessage {
    private content: string;

    constructor(content: string, toUserName: string, fromUserName: string) {
        super({ msgType: 'text', toUserName, fromUserName });
        this.content = content;
    }

    protected toXmlBody(): string {
        return `<Content><![CDATA[${this.content}]]></Content>`;
    }
}

/**
 * 图片消息类
 */
export class WecomReplyImageMessage extends WecomReplyBaseMessage {
    private mediaId: string;

    constructor({ mediaId, toUserName, fromUserName }: { mediaId: string, toUserName: string, fromUserName: string }) {
        super({ msgType: 'image', toUserName, fromUserName });
        this.mediaId = mediaId;
    }

    protected toXmlBody(): string {
        return `<Image><MediaId><![CDATA[${this.mediaId}]]></MediaId></Image>`;
    }
}

/**
 * 语音消息类
 */
export class WecomReplyVoiceMessage extends WecomReplyBaseMessage {
    private mediaId: string;

    constructor({ mediaId, toUserName, fromUserName }: { mediaId: string, toUserName: string, fromUserName: string }) {
        super({ msgType: 'voice', toUserName, fromUserName });
        this.mediaId = mediaId;
    }

    protected toXmlBody(): string {
        return `<Voice><MediaId><![CDATA[${this.mediaId}]]></MediaId></Voice>`;
    }
}

/**
 * 视频消息类
 */
export class WecomReplyVideoMessage extends WecomReplyBaseMessage {
    private mediaId: string;
    private title: string;
    private description: string;

    constructor({ mediaId, title, description, toUserName, fromUserName }: { mediaId: string, title: string, description: string, toUserName: string, fromUserName: string }) {
        super({ msgType: 'video', toUserName, fromUserName });
        this.mediaId = mediaId;
        this.title = title;
        this.description = description;
    }

    protected toXmlBody(): string {
        return `
<Video>
   <MediaId><![CDATA[${this.mediaId}]]></MediaId>
   <Title><![CDATA[${this.title}]]></Title>
   <Description><![CDATA[${this.description}]]></Description>
</Video>
        `.trim();
    }
}

/**
 * 图文消息中的单个新闻项
 */
export class WecomReplyNewsItem {
    private title: string;
    private description: string;
    private picUrl: string;
    private url: string;

    constructor({ title, description, picUrl, url }: { title: string, description: string, picUrl: string, url: string }) {
        this.title = title;
        this.description = description;
        this.picUrl = picUrl;
        this.url = url;
    }

    toXml(): string {
        return `
<item>
   <Title><![CDATA[${this.title}]]></Title>
   <Description><![CDATA[${this.description}]]></Description>
   <PicUrl><![CDATA[${this.picUrl}]]></PicUrl>
   <Url><![CDATA[${this.url}]]></Url>
</item>
        `.trim();
    }
}

/**
 * 创建响应XML
 * @param {string} msg_encrypt - 加密后的消息
 * @param {string} js_api_signature - JS-API签名
 * @returns {string} 响应XML
 */
export function createResponseXml(msg_encrypt: string, js_api_signature: string): string {
    return `
<xml>
   <Encrypt><![CDATA[${msg_encrypt}]]></Encrypt>
   <MsgSignature><![CDATA[${js_api_signature}]]></MsgSignature>
   <TimeStamp>${Math.floor(Date.now() / 1000)}</TimeStamp>
   <Nonce><![CDATA[${Math.floor(Math.random() * 10000000000)}]]></Nonce>
</xml>
    `.trim();
}

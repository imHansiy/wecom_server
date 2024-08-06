import { getJsApiSignature } from "../utils/wecom_crypto";

/**
     * 基础消息类
     */
abstract class BaseMessage {
    protected toUserName: string;
    protected fromUserName: string;
    protected createTime: number;
    protected msgType: string;

    /**
     * 构造函数
     * @param toUserName 接收者用户ID
     * @param fromUserName 发送者企业微信CorpID
     * @param createTime 消息创建时间戳
     * @param msgType 消息类型
     */
    constructor(toUserName: string, fromUserName: string, createTime: number, msgType: string) {
        this.toUserName = toUserName;
        this.fromUserName = fromUserName;
        this.createTime = createTime;
        this.msgType = msgType;
    }

    /**
     * 子类需要实现的方法,返回该消息类型的XML主体部分
     */
    protected abstract toXmlBody(): string;

    /**
     * 返回完整的XML格式
     */
    public toXml(): string {
        return `
<xml>
   <ToUserName><![CDATA[${this.toUserName}]]></ToUserName>
   <FromUserName><![CDATA[${this.fromUserName}]]></FromUserName>
   <CreateTime>${this.createTime}</CreateTime>
   <MsgType><![CDATA[${this.msgType}]]></MsgType>
   ${this.toXmlBody()}
</xml>
`;
    }
}

/**
 * 文本消息类
 */
export class TextMessage extends BaseMessage {
    private content: string;

    /**
     * 构造函数
     * @param toUserName 接收者用户ID
     * @param fromUserName 发送者企业微信CorpID
     * @param createTime 消息创建时间戳
     * @param content 文本消息内容
     */
    constructor(toUserName: string, fromUserName: string, createTime: number, content: string) {
        super(toUserName, fromUserName, createTime, 'text');
        this.content = content;
    }

    protected toXmlBody(): string {
        return `<Content><![CDATA[${this.content}]]></Content>`;
    }
}

/**
 * 图片消息类
 */
export class ImageMessage extends BaseMessage {
    private mediaId: string;

    /**
     * 构造函数
     * @param toUserName 接收者用户ID
     * @param fromUserName 发送者企业微信CorpID
     * @param createTime 消息创建时间戳
     * @param mediaId 图片媒体文件ID
     */
    constructor(toUserName: string, fromUserName: string, createTime: number, mediaId: string) {
        super(toUserName, fromUserName, createTime, 'image');
        this.mediaId = mediaId;
    }

    protected toXmlBody(): string {
        return `<Image><MediaId><![CDATA[${this.mediaId}]]></MediaId></Image>`;
    }
}

/**
 * 语音消息类
 */
export class VoiceMessage extends BaseMessage {
    private mediaId: string;

    /**
     * 构造函数
     * @param toUserName 接收者用户ID
     * @param fromUserName 发送者企业微信CorpID
     * @param createTime 消息创建时间戳
     * @param mediaId 语音文件ID
     */
    constructor(toUserName: string, fromUserName: string, createTime: number, mediaId: string) {
        super(toUserName, fromUserName, createTime, 'voice');
        this.mediaId = mediaId;
    }

    protected toXmlBody(): string {
        return `<Voice><MediaId><![CDATA[${this.mediaId}]]></MediaId></Voice>`;
    }
}

/**
 * 视频消息类
 */
export class VideoMessage extends BaseMessage {
    private mediaId: string;
    private title: string;
    private description: string;

    /**
     * 构造函数
     * @param toUserName 接收者用户ID
     * @param fromUserName 发送者企业微信CorpID
     * @param createTime 消息创建时间戳
     * @param mediaId 视频文件ID
     * @param title 视频标题
     * @param description 视频描述
     */
    constructor(toUserName: string, fromUserName: string, createTime: number, mediaId: string, title: string, description: string) {
        super(toUserName, fromUserName, createTime, 'video');
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
`;
    }
}

/**
 * 图文消息中的单个新闻项
 */
export class NewsItem {
    private title: string;
    private description: string;
    private picUrl: string;
    private url: string;

    /**
     * 构造函数
     * @param title 新闻标题
     * @param description 新闻描述
     * @param picUrl 新闻图片URL
     * @param url 新闻链接
     */
    constructor(title: string, description: string, picUrl: string, url: string) {
        this.title = title;
        this.description = description;
        this.picUrl = picUrl;
        this.url = url;
    }

    /**
     * 返回该新闻项的XML格式
     */
    toXml(): string {
        return `
<item>
   <Title><![CDATA[${this.title}]]></Title>
   <Description><![CDATA[${this.description}]]></Description>
   <PicUrl><![CDATA[${this.picUrl}]]></PicUrl>
   <Url><![CDATA[${this.url}]]></Url>
</item>
`;
    }
}

/**
 * 图文消息类
 */
export class NewsMessage extends BaseMessage {
    private articles: NewsItem[];

    /**
     * 构造函数
     * @param toUserName 接收者用户ID
     * @param fromUserName 发送者企业微信CorpID
     * @param createTime 消息创建时间戳
     * @param articles 图文消息项列表
     */
    constructor(toUserName: string, fromUserName: string, createTime: number, articles: NewsItem[]) {
        super(toUserName, fromUserName, createTime, 'news');
        this.articles = articles;
    }

    protected toXmlBody(): string {
        const articlesXml = this.articles.map((article) => article.toXml()).join('');
        return `
<ArticleCount>${this.articles.length}</ArticleCount>
<Articles>
   ${articlesXml}
</Articles>
`;
    }
}

/**
 * 创建响应XML
 * @param {string} msg_encrypt - 加密后的消息
 * @param {string} js_api_signature - JS-API签名
 * @returns {string} 响应XML
 */
export function createResponseXml(msg_encrypt: string, js_api_signature: string): string {
    return `<xml>
   <Encrypt><![CDATA[${msg_encrypt}]]></Encrypt>
   <MsgSignature><![CDATA[${js_api_signature}]]></MsgSignature>
   <TimeStamp>${Math.floor(Date.now() / 1000)}</TimeStamp>
   <Nonce><![CDATA[${Math.floor(Math.random() * 10000000000)}]]></Nonce>
</xml>`;
}
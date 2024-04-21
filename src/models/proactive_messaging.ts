import { XMLParser } from 'fast-xml-parser';

// 定义各种消息类型的接口
interface ITextMessage {
    MsgType: "text";
    Content: string;
}

interface IImageMessage {
    MsgType: "image";
    PicUrl: string;
    MediaId: string;
}

interface IVoiceMessage {
    MsgType: "voice";
    MediaId: string;
    Format: string;
}

interface IVideoMessage {
    MsgType: "video";
    MediaId: string;
    ThumbMediaId: string;
}

interface ILocationMessage {
    MsgType: "location";
    Location_X: string;
    Location_Y: string;
    Scale: string;
    Label: string;
}

interface ILinkMessage {
    MsgType: "link";
    Title: string;
    Description: string;
    Url: string;
    PicUrl: string;
}

// 使用联合类型定义所有可能的消息类型
type IMessage = ITextMessage | IImageMessage | IVoiceMessage | IVideoMessage | ILocationMessage | ILinkMessage;

// 解析XML文本为对象
function parseXML(xmlText: string): any {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        textNodeName: "#text",
    });
    try {
        return parser.parse(xmlText);
    } catch (error) {
        console.error("XML解析失败:", error);
        return null;
    }
}

// 根据消息类型处理XML对象
function getXMLObject(xmlText: string): IMessage | null {
    const xmlObj = parseXML(xmlText);
    if (!xmlObj || !xmlObj.xml) {
        console.error("XML格式不正确或解析失败");
        return null;
    }

    const msgType = xmlObj.xml.MsgType as string;
    let messageHandler: (msgObj: any) => IMessage;

    switch (msgType) {
        case 'text':
            messageHandler = handleTextMessage;
            break;
        case 'image':
            messageHandler = handleImageMessage;
            break;
        case 'voice':
            messageHandler = handleVoiceMessage;
            break;
        case 'video':
            messageHandler = handleVideoMessage;
            break;
        case 'location':
            messageHandler = handleLocationMessage;
            break;
        case 'link':
            messageHandler = handleLinkMessage;
            break;
        default:
            console.error("未知的消息类型:", msgType);
            return null;
    }

    return messageHandler(xmlObj.xml);
}

// 不同消息类型的处理函数
function handleTextMessage(msgObj: any): IMessage {
    return { MsgType: "text", Content: msgObj.Content };
}

function handleImageMessage(msgObj: any): IMessage {
    return {
        MsgType: "image",
        PicUrl: msgObj.PicUrl,
        MediaId: msgObj.MediaId
    };
}

function handleVoiceMessage(msgObj: any): IMessage {
    return {
        MsgType: "voice",
        MediaId: msgObj.MediaId,
        Format: msgObj.Format
    };
}

function handleVideoMessage(msgObj: any): IMessage {
    return {
        MsgType: "video",
        MediaId: msgObj.MediaId,
        ThumbMediaId: msgObj.ThumbMediaId
    };
}

function handleLocationMessage(msgObj: any): IMessage {
    return {
        MsgType: "location",
        Location_X: msgObj.Location_X,
        Location_Y: msgObj.Location_Y,
        Scale: msgObj.Scale,
        Label: msgObj.Label
    };
}

function handleLinkMessage(msgObj: any): IMessage {
    return {
        MsgType: "link",
        Title: msgObj.Title,
        Description: msgObj.Description,
        Url: msgObj.Url,
        PicUrl: msgObj.PicUrl
    };
}

export { getXMLObject };
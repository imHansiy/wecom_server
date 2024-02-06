// 表示文本消息
type TextMessage = {
    xml: {
        ToUserName: string;   // 接收消息的企业微信 CorpID
        FromUserName: string; // 发送消息的成员 UserID
        CreateTime: number;   // 消息创建时间（整数类型）
        MsgType: string;      // 消息类型，固定为 'text'
        Content: string;      // 文本消息内容
        MsgId: number;        // 消息ID，64位整数
        AgentID: number;      // 企业应用的ID（整数类型）
    };
};

// 表示图片消息
type ImageMessage = {
    xml: {
        ToUserName: string;   // 接收消息的企业微信 CorpID
        FromUserName: string; // 发送消息的成员 UserID
        CreateTime: number;   // 消息创建时间（整数类型）
        MsgType: string;      // 消息类型，固定为 'image'
        PicUrl: string;       // 图片链接
        MediaId: string;      // 图片媒体文件ID，可在3天内获取
        MsgId: number;        // 消息ID，64位整数
        AgentID: number;      // 企业应用的ID（整数类型）
    };
};

// 表示语音消息
type VoiceMessage = {
    xml: {
        ToUserName: string;   // 接收消息的企业微信 CorpID
        FromUserName: string; // 发送消息的成员 UserID
        CreateTime: number;   // 消息创建时间（整数类型）
        MsgType: string;      // 消息类型，固定为 'voice'
        MediaId: string;      // 语音媒体文件ID，可在3天内获取
        Format: string;       // 语音格式，如amr，speex等
        MsgId: number;        // 消息ID，64位整数
        AgentID: number;      // 企业应用的ID（整数类型）
    };
};

// 表示视频消息
type VideoMessage = {
    xml: {
        ToUserName: string;    // 接收消息的企业微信 CorpID
        FromUserName: string;  // 发送消息的成员 UserID
        CreateTime: number;    // 消息创建时间（整数类型）
        MsgType: string;       // 消息类型，固定为 'video'
        MediaId: string;       // 视频媒体文件ID，可在3天内获取
        ThumbMediaId: string;  // 视频消息缩略图的媒体ID，可在3天内获取
        MsgId: number;         // 消息ID，64位整数
        AgentID: number;       // 企业应用的ID（整数类型）
    };
};

// 表示位置消息
type LocationMessage = {
    xml: {
        ToUserName: string;  // 接收消息的企业微信 CorpID
        FromUserName: string; // 发送消息的成员 UserID
        CreateTime: number;   // 消息创建时间（整数类型）
        MsgType: string;      // 消息类型，固定为 'location'
        Location_X: number;   // 地理位置纬度
        Location_Y: number;   // 地理位置经度
        Scale: number;        // 地图缩放大小
        Label: string;        // 地理位置信息
        MsgId: number;        // 消息ID，64位整数
        AgentID: number;      // 企业应用的ID（整数类型）
        AppType: string;      // 应用类型，在企业微信中固定返回 'wxwork'
    };
};

// 表示链接消息
type LinkMessage = {
    xml: {
        ToUserName: string;   // 接收消息的企业微信 CorpID
        FromUserName: string; // 发送消息的成员 UserID
        CreateTime: number;   // 消息创建时间（整数类型）
        MsgType: string;      // 消息类型，固定为 'link'
        Title: string;        // 标题
        Description: string;  // 描述
        Url: string;          // 链接跳转的URL
        PicUrl: string;       // 封面缩略图的URL
        MsgId: number;        // 消息ID，64位整数
        AgentID: number;      // 企业应用的ID（整数类型）
    };
};

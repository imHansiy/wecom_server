// 基础消息类型，包含所有消息共有的属性
type PlaintextMessage = {
  xml: {
    ToUserName: { _cdata: string };
    FromUserName: { _cdata: string };
    CreateTime: { _text: number };
    MsgType: { _cdata: string };
    MsgId: { _text: string };
    AgentID: { _text: number };
  };
};

// 文本消息类型
type PlaintextTextMessage = {
  xml: PlaintextMessage['xml'] & {
    Content: { _cdata: string };
  };
};

// 图片消息类型
type PlaintextImageMessage = {
  xml: PlaintextMessage['xml'] & {
    PicUrl: { _cdata: string };
    MediaId: { _text: string };
  };
};

// 语音消息类型
type PlaintextVoiceMessage = {
  xml: PlaintextMessage['xml'] & {
    MediaId: { _text: string };
    Format: { _cdata: string };
  };
};

// 视频消息类型
type PlaintextVideoMessage = {
  xml: PlaintextMessage['xml'] & {
    MediaId: { _text: string };
    ThumbMediaId: { _cdata: string };
  };
};

// 位置消息类型
type PlaintextLocationMessage = {
  xml: PlaintextMessage['xml'] & {
    Location_X: { _text: number };
    Location_Y: { _text: number };
    Scale: { _text: number };
    Label: { _cdata: string };
    AppType: { _cdata: 'wxwork' };
  };
};

// 链接消息类型
type PlaintextLinkMessage = {
  xml: PlaintextMessage['xml'] & {
    Title: { _cdata: string };
    Description: { _cdata: string };
    Url: { _cdata: string };
    PicUrl: { _cdata: string };
  };
};
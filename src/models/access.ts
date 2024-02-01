type AccessTokenResponse = {
    errcode: number;
    errmsg: string;
    access_token: string;
    expires_in: number;
}

type EncryptedMessage = {
    xml: {
        ToUserName: string;
        Encrypt: string;
        AgentID: number;
    };
}


type ReceivedMessage = {
    xml: {
        ToUserName: string;
        FromUserName: string;
        CreateTime: number;
        MsgType: string;
        Content: string;
        MsgId: number;
        AgentID: number;
    };
}

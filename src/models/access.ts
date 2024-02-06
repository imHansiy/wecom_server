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

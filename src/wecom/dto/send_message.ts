type SendMsgResp = {
    errcode: number; // 返回码
    errmsg: string; // 对返回码的文本描述内容
    invaliduser: string; // 不合法的userid，不区分大小写，统一转为小写
    invalidparty: string; // 不合法的partyid
    invalidtag: string; // 不合法的标签id
    unlicenseduser: string; // 没有基础接口许可(包含已过期)的userid
    msgid: string; // 消息id，用于撤回应用消息
    response_code?: string; // 仅消息类型为“按钮交互型”，“投票选择型”和“多项选择型”的模板卡片消息返回
}

/**
 * @description 用于发送消息的负载结构体
 */
type SendMsgTextPayload = {
    /**
     * @description 指定接收消息的成员，成员ID列表（多个接收者用‘|’分隔，最多支持1000个）。
     * 特殊情况：指定为"@all"，则向该企业应用的全部成员发送。
     * @optional
     */
    touser?: string;

    /**
     * @description 指定接收消息的部门，部门ID列表，多个接收者用‘|’分隔，最多支持100个。
     * 当touser为"@all"时忽略本参数。
     * @optional
     */
    toparty?: string;

    /**
     * @description 指定接收消息的标签，标签ID列表，多个接收者用‘|’分隔，最多支持100个。
     * 当touser为"@all"时忽略本参数。
     * @optional
     */
    totag?: string;

    /**
     * @description 消息类型，此时固定为"text"。
     * @required
     */
    msgtype: string;

    /**
     * @description 企业应用的ID，整型。企业内部开发可在应用的设置页面查看；
     * 第三方服务商可通过接口获取企业授权信息以获取该参数值。
     * @required
     */
    agentid: number;

    /**
     * @description 消息内容，最长不超过2048个字节，超过将截断（支持ID转译）。
     * @required
     */
    text: {
        content: string;
    }

    /**
     * @description 表示是否是保密消息，0表示可对外分享，1表示不能分享且内容显示水印，默认为0。
     * @optional
     */
    safe?: number;

    /**
     * @description 表示是否开启ID转译，0表示否，1表示是，默认0。
     * @optional
     */
    enable_id_trans?: number;

    /**
     * @description 表示是否开启重复消息检查，0表示否，1表示是，默认0。
     * @optional
     */
    enable_duplicate_check?: number;

    /**
     * @description 表示重复消息检查的时间间隔，默认1800秒，最大不超过4小时。
     * @optional
     */
    duplicate_check_interval?: number;
};


// 图片消息类型
type SendMsgImagePayload = {
    touser: string;
    toparty: string;
    totag: string;
    msgtype: 'image';
    agentid: number;
    image: {
        media_id: string;
    };
    safe?: 0 | 1;
    enable_duplicate_check?: 0 | 1;
    duplicate_check_interval?: number;
}

// 语音消息类型
type SendMsgVoicePayload = {
    touser: string;
    toparty: string;
    totag: string;
    msgtype: 'voice';
    agentid: number;
    voice: {
        media_id: string;
    };
    enable_duplicate_check?: 0 | 1;
    duplicate_check_interval?: number;
}

// 视频消息类型
type SendMsgVideoPayload = {
    touser: string;
    toparty: string;
    totag: string;
    msgtype: 'video';
    agentid: number;
    video: {
        media_id: string;
        title?: string;
        description?: string;
    };
    safe?: 0 | 1;
    enable_duplicate_check?: 0 | 1;
    duplicate_check_interval?: number;
}

// 文件消息类型
type SendMsgFilePayload = {
    touser: string;
    toparty: string;
    totag: string;
    msgtype: 'file';
    agentid: number;
    file: {
        media_id: string;
    };
    safe?: 0 | 1;
    enable_duplicate_check?: 0 | 1;
    duplicate_check_interval?: number;
}

// 文本卡片消息类型
type SendMsgTextCardPayload = {
    touser: string;
    toparty: string;
    totag: string;
    msgtype: 'textcard';
    agentid: number;
    textcard: {
        title: string;
        description: string;
        url: string;
        btntxt?: string;
    };
    enable_id_trans?: 0 | 1;
    enable_duplicate_check?: 0 | 1;
    duplicate_check_interval?: number;
}

// 图文消息类型
type SendMsgNewsPayload = {
    touser: string;
    toparty: string;
    totag: string;
    msgtype: 'news';
    agentid: number;
    news: {
        articles: Array<{
            title: string;
            description?: string;
            url?: string;
            picurl?: string;
            appid?: string;
            pagepath?: string;
        }>;
    };
    enable_id_trans?: 0 | 1;
    enable_duplicate_check?: 0 | 1;
    duplicate_check_interval?: number;
}

// 图文消息（mpnews）类型
type SendMsgMpNewsPayload = {
    touser: string;
    toparty: string;
    totag: string;
    msgtype: 'mpnews';
    agentid: number;
    mpnews: {
        articles: Array<{
            title: string;
            thumb_media_id: string;
            author?: string;
            content_source_url?: string;
            content: string;
            digest?: string;
        }>;
    };
    safe?: 0 | 1 | 2;
    enable_id_trans?: 0 | 1;
    enable_duplicate_check?: 0 | 1;
    duplicate_check_interval?: number;
}

// Markdown消息类型
type SendMsgMarkdownPayload = {
    touser: string;
    toparty: string;
    totag: string;
    msgtype: 'markdown';
    agentid: number;
    markdown: {
        content: string;
    };
    enable_duplicate_check?: 0 | 1;
    duplicate_check_interval?: number;
}

// 小程序通知消息类型
type SendMsgMiniProgramNoticePayload = {
    touser: string;
    toparty: string;
    totag: string;
    msgtype: 'miniprogram_notice';
    miniprogram_notice: {
        appid: string;
        page: string;
        title: string;
        description?: string;
        emphasis_first_item?: boolean;
        content_item: Array<{
            key: string;
            value: string;
        }>;
    };
    enable_id_trans?: 0 | 1;
    enable_duplicate_check?: 0 | 1;
    duplicate_check_interval?: number;
}

// 模板卡片消息类型
type SendMsgTemplateCardPayload = {
    touser: string;
    toparty: string;
    totag: string;
    msgtype: 'template_card';
    agentid: number;
    template_card: {
        card_type: 'text_notice' | 'news_notice' | 'button_interaction' | 'vote_interaction' | 'multiple_interaction';
        source?: {
            icon_url?: string;
            desc?: string;
            desc_color?: 0 | 1 | 2 | 3;
        };
        action_menu?: {
            desc?: string;
            action_list: Array<{
                text: string;
                key: string;
            }>;
        };
        task_id?: string;
        // 根据card_type的不同，这里会有不同的字段
        // 以下是text_notice类型的字段
        main_title?: {
            title: string;
            desc?: string;
        };
        quote_area?: {
            type?: number;
            url?: string;
            appid?: string;
            pagepath?: string;
            title?: string;
            quote_text?: string;
        };
        emphasis_content?: {
            title: string;
            desc?: string;
        };
        sub_title_text?: string;
        horizontal_content_list?: Array<{
            type?: number;
            keyname: string;
            value?: string;
            url?: string;
            media_id?: string;
            userid?: string;
        }>;
        jump_list?: Array<{
            type?: number;
            title: string;
            url?: string;
            appid?: string;
            pagepath?: string;
        }>;
        card_action?: {
            type?: number;
            url?: string;
            appid?: string;
            pagepath?: string;
        };
        // 以下是button_interaction类型的字段
        button_selection?: {
            question_key: string;
            title?: string;
            option_list: Array<{
                id: string;
                text: string;
                is_checked?: boolean;
            }>;
            selected_id?: string;
        };
        button_list?: Array<{
            text: string;
            style?: number;
            key?: string;
            type?: number;
            url?: string;
        }>;
        // 以下是vote_interaction和multiple_interaction类型的字段
        // 这里省略了vote_interaction和multiple_interaction类型的具体字段，因为它们与button_interaction类似，但有额外的字段
    };
    enable_id_trans?: 0 | 1;
    enable_duplicate_check?: 0 | 1;
    duplicate_check_interval?: number;
}
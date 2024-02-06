/* 太多了,剩下的用到了再补 */
// 成员关注及取消关注事件
type SubscribeEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // 成员UserID
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息类型，此时固定为:event
    Event: string; // 事件类型，subscribe(关注)、unsubscribe(取消关注)
    EventKey?: string; // 事件KEY值，此事件该值为空
    AgentID: number; // 企业应用的id，整型。可在应用的设置页面查看
};

// 进入应用事件
type EnterAgentEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // 成员UserID
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息类型，此时固定为:event
    Event: string; // 事件类型:enter_agent
    EventKey?: string; // 事件KEY值，此事件该值为空
    AgentID: number; // 企业应用的id，整型。可在应用的设置页面查看
};

// 上报地理位置事件
type LocationEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // 成员UserID
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息类型，此时固定为:event
    Event: string; // 事件类型:LOCATION
    Latitude: number; // 地理位置纬度
    Longitude: number; // 地理位置经度
    Precision: number; // 地理位置精度
    AgentID: number; // 企业应用的id，整型。可在应用的设置页面查看
    AppType?: string; // app类型，在企业微信固定返回wxwork，在微信不返回该字段
};

// 异步任务完成事件推送
type BatchJobResultEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // 成员UserID
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息类型，此时固定为:event
    Event: string; // 事件类型:batch_job_result
    BatchJob: {
        JobId: string; // 异步任务id，最大长度为64字符
        JobType: string; // 操作类型
        ErrCode: number; // 返回码
        ErrMsg: string; // 对返回码的文本描述内容
    };
};

// 关于新增、更新、删除成员/部门事件，由于示例与结构类似，这里以新增部门事件为例：
type CreatePartyEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // sys, 表示该消息由系统生成
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息的类型，此时固定为event
    Event: string; // 事件的类型，此时固定为change_contact
    ChangeType: string; // 此时固定为create_party
    Id: number; // 部门Id
    Name: string; // 部门名称
    ParentId: number; // 父部门id
    Order: number; // 部门排序
};

// 更新成员事件
type UpdateUserEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // sys, 表示该消息由系统生成
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息的类型，此时固定为event
    Event: string; // 事件的类型，此时固定为change_contact
    ChangeType: string; // 更改类型，此时固定为update_user
    UserID: string; // 成员UserID
    NewUserID?: string; // 新的UserID，变更时由系统生成
    Name?: string; // 成员名称，有变更时存在该字段
    Department?: number[]; // 成员部门列表，有变更时存在该字段
    MainDepartment?: number; // 主部门
    IsLeaderInDept?: number[]; // 表示在所在的部门内是否为上级
    Position?: string; // 职位信息
    Mobile?: string; // 手机号码
    Gender?: string; // 性别。1表示男性，2表示女性
    Email?: string; // 邮箱
    Status?: number; // 成员启用状态
    Avatar?: string; // 头像url
    Alias?: string; // 成员别名
    Telephone?: string; // 座机
    Address?: string; // 地址
    ExtAttr?: {
        // 扩展属性
        Attrs: Array<{
            Name: string;
            Value: string;
            Type: number; // 属性类型，目前只有文本类型（text）
            Text: {
                Value: string;
            };
        }>;
    };
};

// 删除成员事件
type DeleteUserEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // sys, 表示该消息由系统生成
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息的类型，此时固定为event
    Event: string; // 事件的类型，change_contact
    ChangeType: string; // 更改类型，delete_user
    UserID: string; // 成员UserID
};

// 新增部门事件
// 注意：CreatePartyEvent 见之前的回答

// 更新部门事件
type UpdatePartyEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // sys, 表示由系统生成
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息的类型，event
    Event: string; // 事件类型，change_contact
    ChangeType: string; // 更改类型，update_party
    Id: number; // 部门Id
    Name?: string; // 部门名称，有变更时存在该字段
    ParentId?: number; // 父部门id，有变更时存在该字段
    Order?: number; // 排序值，有变更时存在该字段
};

// 删除部门事件
type DeletePartyEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // sys, 表示由系统生成
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息的类型，event
    Event: string; // 事件的类型，change_contact
    ChangeType: string; // 更改类型，delete_party
    Id: number; // 部门Id
};

// 标签成员变更事件
type UpdateTagEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // sys, 表示由系统生成
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息的类型，event
    Event: string; // 事件的类型，change_contact
    ChangeType: string; // 更改类型，update_tag
    TagId: number; // 标签Id
    AddUserItems?: string; // 增加成员UserID列表
    DelUserItems?: string; // 删除成员UserID列表
    AddPartyItems?: number[]; // 增加部门列表
    DelPartyItems?: number[]; // 删除的部门列表
};

// 通讯录变更事件
type ChangeContactEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // 成员UserID
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息类型，此时固定为:event
    Event: string; // 事件类型，change_contact
    ChangeType: string; // 变更类型（create_user, update_user, delete_user, create_party, update_party, delete_party, update_tag）
    // 其他字段根据不同 ChangeType 补充
    // 例如新增成员事件的字段（仅示例，应筛选并添加所有可用字段）
    UserID?: string; // 成员UserID
    // ... 其他成员事件相关字段
};

// 具体的 ChangeType 字段及相应属性，需根据实际事件类型和文档描述定义

// 外部联系人变更事件
type ExternalContactEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // 成员UserID
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息类型，此时固定为:event
    Event: string; // 事件类型，外部联系人事件类型如：add_external_contact, edit_external_contact, del_external_contact, del_follow_user
    ChangeType: string; // 变更类型，与Event配合使用，描述具体的变更内容
    // 其他字段根据具体的 ChangeType 补充
    // 例如新增外部联系人事件的字段
    UserID?: string; // 成员UserID
    ExternalUserID?: string; // 外部联系人的userID
    // ... 其他外部联系人事件相关字段
};

// 具体的 ChangeType 字段及相应属性，需根据实际事件类型和文档描述定义

// 点击菜单拉取消息时的事件推送
type ClickEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // 成员UserID
    CreateTime: number; // 消息创建时间
    MsgType: string; // 消息类型，此时固定为:event
    Event: string; // 事件类型，CLICK
    EventKey: string; // 事件KEY值，与自定义菜单接口中KEY值对应
    AgentID: number; // 企业应用的id，整型。可在应用的设置页面查看
};

// 点击菜单跳转链接时的事件推送
type ViewEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // 成员UserID
    CreateTime: number; // 消息创建时间
    MsgType: string; // 消息类型，此时固定为:event
    Event: string; // 事件类型，VIEW
    EventKey: string; // 事件KEY值，设置的跳转URL
    AgentID: number; // 企业应用的id，整型。可在应用的设置页面查看
};

// 审批应用事件
type ApprovalEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // 成员UserID
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息类型，此时固定为:event
    Event: string; // 事件类型，如：open_approval_change
    ApprovalInfo: {
        // 审批信息
        ThirdNo: string; // 审批单编号
        OpenSpName: string; // 审批模板名称
        OpenTemplateId: string; // 审批模板id
        OpenSpStatus: number; // 审批状态
        ApplyTime: number; // 提交审批单的时间戳
        ApplyUserName: string; // 申请人姓名
        ApplyUserId: string; // 申请人 UserId
        ApplyUserParty: string; // 申请人部门
        ApplyUserImage: string; // 申请人头像
        ApprovalNodes: { // 审批流程信息，可能有多个审批节点
            NodeStatus: number; // 节点状态
            NodeAttr: number; // 节点属性
            NodeType: number; // 节点类型
            Items: Array<{ // 节点审批人
                ItemName: string; // 审批人姓名
                ItemUserId: string; // 审批人userid
                ItemImage: string; // 审批人头像
                ItemStatus: number; // 该审批人的审批状态
                ItemSpeech: string; // 审批意见
                ItemOpTime: number; // 操作时间戳
            }>;
        }[];
        NotifyNodes: Array<{ // 抄送信息，可能有多个抄送节点
            ItemName: string; // 抄送人姓名
            ItemUserId: string; // 抄送人userid
            ItemImage: string; // 抄送人头像
            ItemStatus: number; // 抄送状态
        }>;
    };
};

// 应用代开发上链数据事件
type OpenChainEvent = {
    ToUserName: string; // 企业微信CorpID
    FromUserName: string; // 成员UserID
    CreateTime: number; // 消息创建时间(整型)
    MsgType: string; // 消息类型，此时固定为:event
    Event: string; // 事件类型，如：open_chain_change
    ChainInfo: {
        // 上链信息
        ChainDataList: Array<{ // 每次上链的数据列表
            BlockId: string; // 区块id
            BlockDataHash: string; // 数据hash
            BlockTime: number; // 上链时间戳
        }>;
    };
};


type WecomUploadMaterialResponse = {
    errcode: number;     // 错误码
    errmsg: string;      // 错误信息
    type: string;        // 媒体类型
    media_id: string;    // 媒体 ID
    created_at: string;  // 创建时间（通常是时间戳）
};


/**
 * 上传结果接口
 */
type UploadResult = {
    success: boolean;
    error?: string;
    data?: WecomUploadMaterialResponse;
  }
  
  /**
   * 媒体类型配置接口
   */
  type MediaTypeConfig = {
    maxSize: number;
    allowedExtensions: string[];
  }
  
  /**
   * 企业微信支持的媒体类型
   */
  type MediaType = 'image' | 'voice' | 'video' | 'file';
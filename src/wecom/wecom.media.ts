import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { WecomService } from "./wecom.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { join, resolve, isAbsolute, extname } from "path";
import { createWriteStream, createReadStream, existsSync, unlink, statSync } from "fs";
import { basename } from "path";
import * as mime from "mime-types";
import * as FormData from "form-data";

/**
 * 上传结果接口
 */
interface UploadResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * 媒体类型配置接口
 */
interface MediaTypeConfig {
  maxSize: number;
  allowedExtensions: string[];
}

/**
 * 企业微信支持的媒体类型
 */
type MediaType = 'image' | 'voice' | 'video' | 'file';

/**
 * WecomMedia 类用于处理企业微信媒体文件的上传
 * 支持本地文件和网络文件的上传，并自动判断文件类型
 */
@Injectable()
export class WecomMedia {
  private url: string;
  private readonly agentid: string;
  private type: MediaType;

  /**
   * 媒体类型配置
   */
  private readonly mediaTypeConfigs: { [key in MediaType]: MediaTypeConfig } = {
    image: { maxSize: 10 * 1024 * 1024, allowedExtensions: ['.jpg', '.jpeg', '.png'] },
    voice: { maxSize: 2 * 1024 * 1024, allowedExtensions: ['.amr'] },
    video: { maxSize: 10 * 1024 * 1024, allowedExtensions: ['.mp4'] },
    file: { maxSize: 20 * 1024 * 1024, allowedExtensions: [] },
  };

  constructor(
    @Inject(forwardRef(() => WecomService))
    private readonly wecomServer: WecomService,
    private readonly configServer: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.agentid = this.configServer.get<string>("wecom.agentid");
  }

  /**
   * 初始化上传 URL
   */
  private async initUploadUrl(): Promise<void> {
    const accessToken = await this.wecomServer.getAccessToken();
    const baseUrl = this.configServer.get<string>("wecom.baseUrl");
    this.url = `${baseUrl}/cgi-bin/media/upload?access_token=${accessToken}&type=${this.type}`;
  }

  /**
   * 下载网络文件到本地临时目录
   * @param fileUrl 文件 URL
   * @returns 包含本地文件路径和文件名的对象
   */
  private async downloadFile(fileUrl: string): Promise<{ path: string; filename: string }> {
    const response = await this.httpService.get(fileUrl, { responseType: 'stream' }).toPromise();
    const filename = this.getFilenameFromResponse(response);
    const tempFilePath = join(__dirname, filename);
    const writer = createWriteStream(tempFilePath);

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', () => resolve({ path: tempFilePath, filename }));
      writer.on('error', reject);
    });
  }

  /**
   * 从响应头中获取文件名
   * @param response HTTP 响应对象
   * @returns 文件名
   */
  private getFilenameFromResponse(response: any): string {
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch) {
        return filenameMatch[1];
      }
    }
    return 'downloaded-file';
  }

  /**
   * 获取本地文件的绝对路径
   * @param filePath 文件路径
   * @returns 绝对文件路径
   */
  private getLocalFilePath(filePath: string): string {
    return isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
  }

  /**
   * 判断是否为网络资源
   * @param path 路径
   * @returns 是否为网络资源
   */
  private isNetworkResource(path: string): boolean {
    try {
      new URL(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 根据文件扩展名检测媒体类型
   * @param filePath 文件路径
   * @returns 媒体类型
   */
  private detectMediaType(filePath: string): MediaType {
    const ext = extname(filePath).toLowerCase();
    for (const [type, config] of Object.entries(this.mediaTypeConfigs)) {
      if (config.allowedExtensions.includes(ext)) {
        return type as MediaType;
      }
    }
    return 'file';
  }

  /**
   * 验证文件是否符合上传要求
   * @param filePath 文件路径
   * @param type 媒体类型
   * @returns 错误信息，如果文件有效则返回 null
   */
  private validateFile(filePath: string, type: MediaType): string | null {
    const config = this.mediaTypeConfigs[type];
    const fileExt = extname(filePath).toLowerCase();
    const fileSize = statSync(filePath).size;

    if (config.allowedExtensions.length > 0 && !config.allowedExtensions.includes(fileExt)) {
      return `不支持的文件格式: ${fileExt}. 此类型支持的格式: ${config.allowedExtensions.join(', ')}`;
    }

    if (fileSize > config.maxSize) {
      const maxSizeMB = config.maxSize / 1024 / 1024;
      const fileSizeMB = fileSize / 1024 / 1024;
      return `文件大小超出限制. 最大允许: ${maxSizeMB}MB, 当前文件: ${fileSizeMB.toFixed(2)}MB`;
    }

    return null;
  }

  /**
   * 上传媒体文件到企业微信
   * @param filePath 文件路径（本地路径或 URL）
   * @returns 上传结果
   */
  async uploadMedia(filePath: string): Promise<UploadResult> {
    try {
      const { localFilePath, filename } = await this.prepareFile(filePath);
      this.type = this.detectMediaType(localFilePath);

      const validationError = this.validateFile(localFilePath, this.type);
      if (validationError) {
        return { success: false, error: validationError };
      }

      await this.initUploadUrl();
      const formData = this.createFormData(localFilePath, filename);
      const response = await this.sendUploadRequest(formData);

      return { success: true, data: response.data };
    } catch (error) {
      console.error('上传媒体文件失败:', error);
      return { success: false, error: '上传媒体文件失败: ' + error.message };
    }
  }

  /**
   * 准备上传文件
   * @param filePath 文件路径（本地路径或 URL）
   * @returns 本地文件路径和文件名
   */
  private async prepareFile(filePath: string): Promise<{ localFilePath: string; filename: string }> {
    if (this.isNetworkResource(filePath)) {
      const downloadedFile = await this.downloadFile(filePath);
      return { localFilePath: downloadedFile.path, filename: downloadedFile.filename };
    } else {
      const localFilePath = this.getLocalFilePath(filePath);
      if (!existsSync(localFilePath)) {
        throw new Error(`找不到本地文件: ${localFilePath}`);
      }
      return { localFilePath, filename: basename(localFilePath) };
    }
  }

  /**
   * 创建表单数据
   * @param filePath 文件路径
   * @param filename 文件名
   * @returns 表单数据
   */
  private createFormData(filePath: string, filename: string): FormData {
    const formData = new FormData();
    formData.append('media', createReadStream(filePath), {
      filename: filename,
      contentType: mime.lookup(filename) || 'application/octet-stream'
    });
    return formData;
  }

  /**
   * 发送上传请求
   * @param formData 表单数据
   * @returns HTTP 响应
   */
  private async sendUploadRequest(formData: FormData): Promise<any> {
    return this.httpService.post(this.url, formData, {
      headers: {
        ...formData.getHeaders()
      },
    }).toPromise();
  }
}
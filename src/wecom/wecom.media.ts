import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { WecomService } from "./wecom.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { join } from "path";
import { writeFileSync } from "fs";
const FormData = require('form-data');

@Injectable()
export class WecomMedia {
  private url;
  private agentid;
  private type;
  constructor(
    @Inject(forwardRef(() => WecomService))
    private readonly wecomServer: WecomService,
    private readonly configServer: ConfigService,
    private readonly httpService: HttpService,

  ) {
    this.agentid = this.configServer.get<string>("wecom.agentid")
  }

  async init() {
    this.url = `${this.configServer.get<string>("wecom.baseUrl")}/cgi-bin/media/upload?access_token=${await this.wecomServer.getAccessToken()}&type=${this.type}`;
  }

  // 下载网络文件到本地临时目录
  private async downloadFile(fileUrl: string): Promise<string> {
    const response = await this.httpService.get(fileUrl, { responseType: 'stream' }).toPromise();
    const form = new FormData();
    form.append('file', response.data, 'image.jpg'); // 将流附加到 FormData 中

    const tempFilePath = join(__dirname, 'temp-file');
    writeFileSync(tempFilePath, response.data);
    console.log(response.data);
    return tempFilePath;
  }

  // 核心媒体上传方法
  async uploadMedia(type: string, filePath: string, isNetworkPath: boolean = false) {
    this.type = type
    this.init()
    let localFilePath = filePath;

    // 如果是网络路径，则下载文件到本地临时目录
    if (isNetworkPath) {
      console.log("触发了下载文件");

      // 1. 请求图片数据
      const { data } = await this.httpService.get(filePath, {
        responseType: 'stream',
      }).toPromise();


      const formData = new FormData();
      formData.append('media', data, {
        filename: "测试图片.jpg",
        contentType: 'application/octet-stream' // 根据需要调整 Content-Type
      });

      const req = await this.httpService.post(this.url, formData, {
        headers: {
          ...formData.getHeaders()
        },
      }).toPromise();

      console.log(req.data);

    }
    return null;
  }
}
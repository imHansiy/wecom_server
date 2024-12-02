import { createReadStream, createWriteStream } from "fs";
import * as path from "path";
import * as ffmpeg from "fluent-ffmpeg";
import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import axios from "axios";
import { Readable, PassThrough } from "stream";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

interface ConvertToAmrResult {
  stream: Readable;
  filePath: string;
}

/* 将音频转换为AMR格式
 * @param filePath 音频文件路径，可以是本地文件或网络文件
 * @param outputDir 输出目录，默认为当前目录
 * @returns 包含AMR格式音频文件流和本地文件路径的对象
 */
export const convertToAmr = async (filePath: string, outputDir: string = '.'): Promise<ConvertToAmrResult> => {
  let inputStream: Readable;

  // 判断是本地文件还是网络文件
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    // 如果是网络文件，使用axios下载
    const response = await axios({
      method: 'get',
      url: filePath,
      responseType: 'stream'
    });
    inputStream = response.data;
  } else {
    // 如果是本地文件，直接创建读取流
    inputStream = createReadStream(filePath);
  }

  // 创建输出文件名
  const outputFileName = `output_${Date.now()}.amr`;
  const outputFilePath = path.join(outputDir, outputFileName);

  // 创建一个 PassThrough 流，用于 ffmpeg 输出
  const outputStream = new PassThrough();

  // 创建文件写入流
  const fileWriteStream = createWriteStream(outputFilePath);

  // 使用 ffmpeg 转换音频格式
  ffmpeg(inputStream)
    .audioChannels(1)
    .audioFrequency(8000)
    .audioCodec("libopencore_amrnb")
    .audioBitrate("12.2k")
    .toFormat("amr")
    .on("start", (commandLine) => {
      console.log('FFmpeg 进程已启动：', commandLine);
    })
    .on("error", (err, stdout, stderr) => {
      console.error("FFmpeg 错误：", err.message);
      console.error("FFmpeg 标准输出：", stdout);
      console.error("FFmpeg 标准错误：", stderr);
      outputStream.emit('error', err);
      fileWriteStream.emit('error', err);
    })
    .on("end", () => {
      console.log("FFmpeg 处理完成");
      console.log("AMR 文件已保存至：", outputFilePath);
    })
    .pipe(outputStream)
    .pipe(fileWriteStream);

  return { stream: outputStream, filePath: outputFilePath };
};
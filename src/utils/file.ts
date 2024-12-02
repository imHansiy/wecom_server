import { Readable } from "stream";
import * as path from 'path';

export async function detectStreamType(stream: Readable): Promise<string> {
const { fileTypeFromStream } = await (eval('import("file-type")') as Promise<typeof import('file-type')>);
  const type = await fileTypeFromStream(stream);
  // 使用file-type库的read函数来读取流并确定文件类型

  // 如果file-type无法识别文件类型，type可能是null
  if (type === null) {
    return 'application/octet-stream'; // 返回默认MIME类型
  }

  // 返回识别到的MIME类型
  return type.mime;
}

/**
 * 获取流的大小
 * @param stream 输入流
 * @returns Promise<number> 返回流的字节大小
 */
export async function getStreamSize(stream: Readable): Promise<number> {
  return new Promise((resolve, reject) => {
    let totalSize = 0;

    // 监听流中的数据
    stream.on('data', (chunk: Buffer) => {
      totalSize += chunk.length;
    });

    // 监听流的结束事件
    stream.on('end', () => {
      resolve(totalSize);
    });

    // 监听流的错误事件
    stream.on('error', (err) => {
      reject(err);
    });
  });
}
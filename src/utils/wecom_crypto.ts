export async function getSignature(token: any, timestamp: any, nonce: any, encrypt: any) {
    const data = new TextEncoder().encode([token, timestamp, nonce, encrypt].sort().join(''));
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function decrypt(encodingAESKey: string, encrypt: string): Promise<{ message: string; id: string }> {
    // 第一步：转换EncodingAESKey
    const rawKey: string = atob(encodingAESKey + '=');
    const keyUint8Array: Uint8Array = new Uint8Array(new ArrayBuffer(rawKey.length));
    for (let i: number = 0; i < rawKey.length; i++) {
        keyUint8Array[i] = rawKey.charCodeAt(i);
    }

    // 第二步：AESKey和IV的处理
    const iv: Uint8Array = keyUint8Array.slice(0, 16);
    const key: Uint8Array = keyUint8Array.slice(0, 32);

    // 第三步：对encrypt进行Base64解码
    const encryptedData: string = atob(encrypt);
    const encryptedDataArray: Uint8Array = new Uint8Array(new ArrayBuffer(encryptedData.length));
    for (let i: number = 0; i < encryptedData.length; i++) {
        encryptedDataArray[i] = encryptedData.charCodeAt(i);
    }

    // 第四步：导入密钥
    const cryptoKey: CryptoKey = await crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);

    // 第五步：AES-256-CBC解密
    const decryptedData: ArrayBuffer = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, cryptoKey, encryptedDataArray);

    // 第六步：处理解密后数据
    const decryptedDataBuffer: Uint8Array = new Uint8Array(decryptedData);
    // 去掉16字节的随机数和4字节消息长度
    const msgLength: number = decryptedDataBuffer[16] * 256 * 256 * 256 +
        decryptedDataBuffer[17] * 256 * 256 +
        decryptedDataBuffer[18] * 256 +
        decryptedDataBuffer[19];

    const message: string = String.fromCharCode.apply(null, Array.from(decryptedDataBuffer.slice(20, 20 + msgLength)));
    const id: string = String.fromCharCode.apply(null, Array.from(decryptedDataBuffer.slice(20 + msgLength)));

    return { message, id };
}
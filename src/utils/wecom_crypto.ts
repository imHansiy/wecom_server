import * as CryptoJS from 'crypto-js';

export async function getSignature(token: any, timestamp: any, nonce: any, encrypt: any) {
    const data = new TextEncoder().encode([token, timestamp, nonce, encrypt].sort().join(''));
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 解密
 *
 * @param encodingAESKey EncodingAESKey
 * @param encryptTxt     密文
 */
export function decrypt(encodingAESKey: string, encryptTxt: string) {
    const key = CryptoJS.enc.Base64.parse(encodingAESKey);
    const iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4));
    const encrypted = CryptoJS.enc.Base64.parse(encryptTxt);
    const latin1String = CryptoJS.AES.decrypt(
        { ciphertext: encrypted } as  CryptoJS.lib.CipherParams,
        key,
        { iv: iv }
    ).toString(CryptoJS.enc.Latin1);

    const decoder = new TextDecoder();
    const bytes = new Uint8Array(latin1String.split('').map((char) => char.charCodeAt(0)));
    const utf8String = decoder.decode(bytes);
    //  去掉前16随机字节和4个字节的msg_len
    const message = utf8String.substring(16);

    return {
        id: utf8String.slice(utf8String.length - 18,utf8String.length ),
        message: utf8String.slice(20, utf8String.length - 18),
        random: utf8String.slice(0, 16)
    };
}
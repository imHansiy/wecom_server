export async function getSignature(token: string, timestamp: string, nonce: string, encrypt: string): Promise<string> {
    const data = new TextEncoder().encode([token, timestamp, nonce, encrypt].sort().join(''));
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function decrypt(encodingAESKey: string, encrypt: string): Promise<{ message: string, id: string, random: Uint8Array }> {
    const { key, iv } = await parseEncodingAESKey(encodingAESKey);
    const encryptedData = atob(encrypt);
    const encryptedBuffer = new Uint8Array(encryptedData.length);
    for (let i = 0; i < encryptedData.length; i++) {
        encryptedBuffer[i] = encryptedData.charCodeAt(i);
    }
    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        key,
        encryptedBuffer
    );
    const unpaddedBuffer = pkcs7Unpad(new Uint8Array(decryptedBuffer));
    const length = new DataView(unpaddedBuffer.buffer, 16, 4).getUint32(0, false);
    const message = new TextDecoder().decode(unpaddedBuffer.slice(20, length + 20));
    const id = new TextDecoder().decode(unpaddedBuffer.slice(length + 20));
    return { message, id, random: unpaddedBuffer.slice(0, 16) };
}

async function encrypt(encodingAESKey: string, message: string, id: string, random: Uint8Array = crypto.getRandomValues(new Uint8Array(16))): Promise<string> {
    const { key, iv } = await parseEncodingAESKey(encodingAESKey);
    const msgBuffer = new TextEncoder().encode(message);
    const msgLength = new ArrayBuffer(4);
    new DataView(msgLength).setUint32(0, msgBuffer.length, false);
    const encoded = pkcs7Pad(new Uint8Array([...random, ...new Uint8Array(msgLength), ...msgBuffer, ...new TextEncoder().encode(id)]));
    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        key,
        encoded
    );
    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}

async function getJsApiSignature(options: { url: string, ticket: string, nonceStr?: string, timestamp?: number }): Promise<{ timestamp: number, nonceStr: string, signature: string }> {
    const nonceStr = options.nonceStr || Math.random().toString(36).slice(2);
    const timestamp = options.timestamp || Math.floor(Date.now() / 1000);
    const rawString = `jsapi_ticket=${options.ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${options.url}`;
    const data = new TextEncoder().encode(rawString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const signature = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    return { timestamp, nonceStr, signature };
}

function pkcs7Unpad(data: Uint8Array): Uint8Array {
    const padLength = data[data.length - 1];
    if (padLength < 1 || padLength > 32) {
        return data;
    }
    return data.slice(0, data.length - padLength);
}

function pkcs7Pad(data: Uint8Array): Uint8Array {
    const padLength = 32 - (data.length % 32);
    const result = new Uint8Array(padLength).fill(padLength);
    return new Uint8Array([...data, ...result]);
}

async function parseEncodingAESKey(encodingAESKey: string): Promise<{ key: CryptoKey, iv: Uint8Array }> {
    // The base64 string must be url-safe base64 (without padding '=')
    const encodingAESKeyWithoutPadding = encodingAESKey.replace(/=+$/, '');

    // Convert base64 string to binary data
    const binaryStr = atob(encodingAESKeyWithoutPadding);

    // Convert binary string to Uint8Array buffer
    const keyBuffer = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        keyBuffer[i] = binaryStr.charCodeAt(i);
    }

    // Check if the keyBuffer's byteLength is 32
    if (keyBuffer.byteLength !== 32) {
        throw new Error('Invalid encodingAESKey length.');
    }

    const iv = keyBuffer.slice(0, 16);
    const key = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        'AES-CBC',
        false,
        ['encrypt', 'decrypt']
    );
    return { key, iv };
}
import * as CryptoJS from 'crypto-js';
import { EncryptRsa, DecryptRsa } from './RSA'

const generateIv = (length = 16) => {
    // 使用Web Crypto API生成安全的随机字节
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').substring(0, length);
    }

    // 降级方案：使用crypto-js的随机生成
    if (typeof CryptoJS !== 'undefined' && CryptoJS.lib && CryptoJS.lib.WordArray) {
        return CryptoJS.lib.WordArray.random(length / 2).toString().substring(0, length);
    }

    // 最后的降级方案（不推荐用于生产环境）
    const chars = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const generateKey = (length = 32) => {
    // 使用Web Crypto API生成安全的随机字节
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from(array, byte => chars[byte % chars.length]).join('');
    }

    // 降级方案：使用crypto-js的随机生成
    if (typeof CryptoJS !== 'undefined' && CryptoJS.lib && CryptoJS.lib.WordArray) {
        const wordArray = CryptoJS.lib.WordArray.random(length);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const bytes = [];
        for (let i = 0; i < wordArray.words.length; i++) {
            const word = wordArray.words[i];
            bytes.push((word >>> 24) & 0xff);
            bytes.push((word >>> 16) & 0xff);
            bytes.push((word >>> 8) & 0xff);
            bytes.push(word & 0xff);
        }
        return bytes.slice(0, length).map(byte => chars[byte % chars.length]).join('');
    }

    // 最后的降级方案（不推荐用于生产环境）
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

//加密
const generateEncrypt = (w, key, iv) => {
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(w), CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString().toUpperCase();
}

const Decrypt = (key, iv, ...words) => {
    key = DecryptRsa(key)
    iv = DecryptRsa(iv)
    let decryptedArray = [];
    for (let index = 0, len = words.length; index < len; index++) {
        let word = words[index];
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        decryptedArray.push(decryptedStr.toString());
    }
    return decryptedArray;
}

const Encrypt = (...words) => {
    let key = generateKey(32)
    let iv = generateIv(16)
    let encryptedArray = []
    for (let index = 0, len = words.length; index < len; index++) {
        encryptedArray.push(generateEncrypt(words[index], key, iv))
    }
    return [...encryptedArray, EncryptRsa(key), EncryptRsa(iv)];
}

export {
    Decrypt,
    Encrypt
}
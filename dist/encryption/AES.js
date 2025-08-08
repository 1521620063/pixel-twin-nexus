"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encrypt = exports.Decrypt = void 0;
const CryptoJS = require("crypto-js");
const crypto_1 = require("crypto");
const RSA_1 = require("./RSA");
const generateIv = (length = 16) => {
    try {
        const randomBuffer = (0, crypto_1.randomBytes)(length);
        return randomBuffer.toString('hex').toUpperCase();
    }
    catch (error) {
        console.error('生成IV失败:', error.message);
        throw new Error('生成初始化向量失败');
    }
};
const generateKey = (length = 32) => {
    try {
        const randomBuffer = (0, crypto_1.randomBytes)(length);
        return randomBuffer.toString('hex').toUpperCase();
    }
    catch (error) {
        console.error('生成密钥失败:', error.message);
        throw new Error('生成加密密钥失败');
    }
};
const generateEncrypt = (text, key, iv) => {
    try {
        if (!text || !key || !iv) {
            throw new Error('加密参数不能为空');
        }
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString().toUpperCase();
    }
    catch (error) {
        console.error('AES加密失败:', error.message);
        throw new Error(`AES加密失败: ${error.message}`);
    }
};
const Decrypt = (encryptedKey, encryptedIv, ...encryptedArray) => {
    try {
        const key = (0, RSA_1.DecryptRsa)(encryptedKey);
        const iv = (0, RSA_1.DecryptRsa)(encryptedIv);
        let decryptArray = [];
        for (let index = 0, len = encryptedArray.length; index < len; index++) {
            const encryptedText = encryptedArray[index];
            const encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedText);
            const base64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
            const decrypted = CryptoJS.AES.decrypt(base64Str, CryptoJS.enc.Utf8.parse(key), {
                iv: CryptoJS.enc.Utf8.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            decryptArray.push(decrypted.toString(CryptoJS.enc.Utf8));
        }
        return decryptArray;
    }
    catch (error) {
        console.error('AES解密失败:', error.message);
        throw new Error(`AES解密失败: ${error.message}`);
    }
};
exports.Decrypt = Decrypt;
const Encrypt = (...words) => {
    try {
        if (!words || words.length === 0) {
            throw new Error('没有要加密的内容');
        }
        const key = generateKey(32);
        const iv = generateIv(16);
        const encryptedArray = [];
        for (let index = 0; index < words.length; index++) {
            if (words[index] !== null && words[index] !== undefined) {
                encryptedArray.push(generateEncrypt(words[index], key, iv));
            }
        }
        const encryptedKey = (0, RSA_1.EncryptRsa)(key);
        const encryptedIv = (0, RSA_1.EncryptRsa)(iv);
        return [...encryptedArray, encryptedKey, encryptedIv];
    }
    catch (error) {
        console.error('批量加密失败:', error.message);
        throw new Error(`批量加密失败: ${error.message}`);
    }
};
exports.Encrypt = Encrypt;
//# sourceMappingURL=AES.js.map
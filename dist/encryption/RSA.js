"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRSAKeyPair = exports.DecryptRsa = exports.EncryptRsa = void 0;
const JSEncrypt = require("node-jsencrypt");
const EncryptRsa = (word, publicKey) => {
    try {
        const encryptor = new JSEncrypt();
        const keyToUse = publicKey || process.env.RSA_PUBLIC_KEY;
        if (!keyToUse) {
            throw new Error('RSA公钥未配置，请设置RSA_PUBLIC_KEY环境变量或传入publicKey参数');
        }
        encryptor.setPublicKey(keyToUse);
        const encrypted = encryptor.encrypt(word);
        if (!encrypted) {
            throw new Error('RSA加密失败');
        }
        return encrypted;
    }
    catch (error) {
        console.error('RSA加密错误:', error.message);
        return null;
    }
};
exports.EncryptRsa = EncryptRsa;
const DecryptRsa = (word, privateKey) => {
    try {
        const decrypt = new JSEncrypt();
        const keyToUse = privateKey || process.env.RSA_PRIVATE_KEY;
        if (!keyToUse) {
            throw new Error('RSA私钥未配置，请设置RSA_PRIVATE_KEY环境变量或传入privateKey参数');
        }
        decrypt.setPrivateKey(keyToUse);
        const decrypted = decrypt.decrypt(word);
        if (decrypted === false || decrypted === null) {
            throw new Error('RSA解密失败');
        }
        return decrypted;
    }
    catch (error) {
        console.error('RSA解密错误:', error.message);
        return null;
    }
};
exports.DecryptRsa = DecryptRsa;
const generateRSAKeyPair = (options = {}) => {
    const { keySize = 2048 } = options;
    const jsencrypt = new JSEncrypt({ default_key_size: keySize });
    return {
        publicKey: jsencrypt.getPublicKey(),
        privateKey: jsencrypt.getPrivateKey()
    };
};
exports.generateRSAKeyPair = generateRSAKeyPair;
//# sourceMappingURL=RSA.js.map
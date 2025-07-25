import JSEncrypt from 'jsencrypt'

//加密
const EncryptRsa = (word) => {
    // 创建加密对象实例
    let encryptor = new JSEncrypt()
    //设置公钥
    encryptor.setPublicKey(import.meta.env.VITE_RSA_PUBLIC_KEY)
    // 对内容进行加密
    return encryptor.encrypt(word)
}
const DecryptRsa = (word) => {
    //创建解密对象实例
    let decrypt = new JSEncrypt()
    //设置秘钥
    decrypt.setPrivateKey(import.meta.env.VITE_RSA_PRIVATE_KEY)
    //解密返回
    return decrypt.decrypt(word)
}

export {
    EncryptRsa,
    DecryptRsa
}
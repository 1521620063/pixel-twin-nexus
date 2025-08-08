interface RSAOptions {
    keySize?: number;
    scheme?: 'pkcs1_oaep' | 'pkcs1';
    hash?: 'sha1' | 'sha256';
}
interface RSAKeyPair {
    publicKey: string;
    privateKey: string;
}
declare const EncryptRsa: (word: string, publicKey?: string) => string | null;
declare const DecryptRsa: (word: string, privateKey?: string) => string | null;
declare const generateRSAKeyPair: (options?: RSAOptions) => RSAKeyPair;
export { EncryptRsa, DecryptRsa, generateRSAKeyPair, type RSAOptions, type RSAKeyPair };

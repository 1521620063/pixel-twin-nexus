interface AESEncryptResult {
    encryptedData: string[];
    encryptedKey: string | null;
    encryptedIv: string | null;
}
declare const Decrypt: (encryptedKey: string, encryptedIv: string, ...encryptedArray: string[]) => string[];
declare const Encrypt: (...words: string[]) => (string | null)[];
export { Decrypt, Encrypt, type AESEncryptResult };

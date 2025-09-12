import CryptoJS from 'crypto-js';

const secretKey = '8bbf';
// Encrypt function
export function encryptValue(value) {
  const stringValue = value.toString();
  return CryptoJS.AES.encrypt(stringValue, secretKey).toString();
}
// Decrypt function
export function decryptValue(encryptedValue) {
  if (!encryptedValue || typeof encryptedValue !== 'string') {
    throw new Error('Encrypted value must be a valid string');
  }
  const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if (!originalText) {
    throw new Error('Decryption failed: Invalid data or secret key');
  }
  return originalText;
}
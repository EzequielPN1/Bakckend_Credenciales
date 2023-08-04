import crypto from 'crypto';
import config from "../config.js";

const encryptionKey = config.CIFRADOR_KEY;

class Cifrador {

  
  generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex'); 
  }

  EncryptBase64AES = (text) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
    let encrypted = [iv, cipher.update(text, 'utf8')];
    encrypted.push(cipher.final());
    return {
      ciphertext: Buffer.concat(encrypted).toString('base64'),
      tag: cipher.getAuthTag().toString('base64')
    };
  };

  DecryptBase64AES = (ciphertext, tag) => {
    const contents = Buffer.from(ciphertext, 'base64');
    const iv = contents.subarray(0, 12);
    const textBytes = contents.subarray(12);
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    let res = decipher.update(textBytes, '', 'utf8');
    res += decipher.final('utf8');
    return res;
  };
}

export default Cifrador;

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const alg = 'aes-256-cbc';

export const encrypt = (
  data: string,
  key: string
): Promise<{ encrypted: string; iv: string }> =>
  new Promise((resolve, reject) => {
    randomBytes(16, (err, iv) => {
      if (err) {
        reject(err);
        return;
      }

      const cipher = createCipheriv(alg, Buffer.from(key), iv);

      let encrypted = cipher.update(data);
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      resolve({
        encrypted: encrypted.toString('hex'),
        iv: iv.toString('hex')
      });
    });
  });

export const decrypt = (encrypted: string, iv: string, key: string): string => {
  const ivBuff = Buffer.from(iv, 'hex');
  const encBuf = Buffer.from(encrypted, 'hex');

  const decipher = createDecipheriv(alg, Buffer.from(key), ivBuff);

  let decrypted = decipher.update(encBuf);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

export default { decrypt, encrypt };

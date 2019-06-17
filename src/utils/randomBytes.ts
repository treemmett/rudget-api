import { randomBytes as rB } from 'crypto';

const randomBytes = (size: number): Promise<Buffer> =>
  new Promise((resolve, reject) =>
    rB(size, (err, buff) => {
      if (err) {
        reject(err);
      } else {
        resolve(buff);
      }
    })
  );

export default randomBytes;

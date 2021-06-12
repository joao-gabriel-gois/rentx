import multer from 'multer';
import crypto from 'crypto';
import { resolve } from 'path';

export default function upload(folder: string) {
  let filename: string;
  const fileHash = crypto.randomBytes(16).toString('hex');

  return {
    path: resolve(__dirname, '..', '..', 'tmp', folder),
    storage: multer.diskStorage({
      destination: resolve(__dirname, '..', '..', 'tmp', folder),
      filename: (request, file, callback) => {
        filename = `${fileHash}-${file.originalname}`;
        return callback(null, filename);
      },
    }),
    fileHash,
  };

}
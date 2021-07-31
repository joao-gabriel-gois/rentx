import fs from 'fs';
import { resolve } from 'path';

import upload from '@config/upload';
import IStorageProvider from "../IStorageProvider";


export default class LocalStorageProvider implements IStorageProvider {
  
  async save(folder: string, file: string): Promise<string> {
    await fs.promises.rename(
      resolve(upload.tmpFolder, file),
      resolve(`${upload.tmpFolder}/${folder}`, file)
    );

    return file;
  }

  async delete(folder: string, file: string): Promise<void> {
    const filePath = resolve(`${upload.tmpFolder}/${folder}`, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }

}
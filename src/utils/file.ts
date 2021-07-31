import setUploadStorageFromTmpOn from '@config/upload';
import fs from 'fs';
import { resolve } from 'path';


export interface ICreateFakeFileRequest {
  folder: string;
  filename: string;
  extension?: string;
  content?: string;
}
export interface ICreateFakeFileResponse extends Express.Multer.File {
  filename: string;
  path: string;
}

export const hasFile = async (filename: string): Promise<boolean> => {
  let hasFile;
  try {
    hasFile = await fs.promises.stat(filename);
  } catch {
    hasFile = false;  
  } finally {
    return !!hasFile;
  }
};

export const deleteFile = async (filename: string): Promise<void> => {
  if (!hasFile(filename)) return;

  await fs.promises.unlink(filename);
};

export const createFile = ({
    folder,
    filename,
    extension = 'txt',
    content = 'SomeContent'
}: ICreateFakeFileRequest): ICreateFakeFileResponse => {
  let { path, fileHash } = setUploadStorageFromTmpOn(folder);
  filename = `${fileHash}-${filename}.${extension}`;
  path = resolve(path, filename);
  
  fs.appendFile(path, content, (e) => {
    if (e) throw Error('Error creating file');
  });

  const result = {} as ICreateFakeFileResponse;

  Object.assign(result, {
    filename,
    path
  });

  return result;
}
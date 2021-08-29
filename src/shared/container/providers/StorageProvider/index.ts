import { container } from 'tsyringe';
import IStorageProvider from './IStorageProvider';
import LocalStorageProvider from './implementations/LocalStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

const storageProvider = {
  local: container.resolve(LocalStorageProvider),
  s3: container.resolve(S3StorageProvider)
}

container.registerInstance<IStorageProvider>(
  'StorageProvider',
  //@ts-ignore
  storageProvider[process.env.DISK]
)


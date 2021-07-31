import { container, InjectionToken } from 'tsyringe';

import IDateProvider from './DateProvider/IDateProvider';
import DayjsDateProvider from './DateProvider/implementations/DayjsDateProvider';

import IMailProvider from './MailProvider/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import LocalStorageProvider from './StorageProvider/implementations/LocalSotrageProvider';
import S3StorageProvider from './StorageProvider/implementations/S3StorageProvider';
import IStorageProvider from './StorageProvider/IStorageProvider';

const storageOptions = {
  local: LocalStorageProvider,
  s3: S3StorageProvider
};

container.registerSingleton<IDateProvider>(
  'DateProvider',
  DayjsDateProvider
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  new EtherealMailProvider()
);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  // @ts-ignore
  storageOptions[process.env.DISK]
)

import { inject, injectable } from "tsyringe";
import { deleteFile } from "@utils/file";
import IUsersRepository from "@modules/accounts/repositories/IUsersRepository";
import IStorageProvider from "@shared/container/providers/StorageProvider/IStorageProvider";
import AppError from "@shared/errors/AppError";


interface IRequest {
  user_id: string;
  avatar_file: string;
}
@injectable()
export default class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider 
  ) {};


  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    if (user.avatar) await this.storageProvider.delete('avatar-images', user.avatar);

    await this.storageProvider.save('avatar-images', avatar_file);

    user.avatar = avatar_file;

    await this.usersRepository.createOrUpdate(user);
  }
}

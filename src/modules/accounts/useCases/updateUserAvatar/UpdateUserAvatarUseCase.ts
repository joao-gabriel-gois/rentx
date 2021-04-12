import { inject, injectable } from "tsyringe";
import { deleteFile } from "../../../../utils/file";
import IUsersRepository from "../../repositories/IUsersRepository";


interface IRequest {
  user_id: string;
  avatar_file: string;
}
@injectable()
export default class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {};


  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    // exclamation mark bellow is there to inform TS that this value will never be 
    // undefined or null once findById may return undefined, but in this case it will
    // never do it because auth middleware will ensure that this execution will always
    // happen for a valid user
    if (user!.avatar) await deleteFile(`./tmp/avatar-images/${user!.avatar}`);

    user!.avatar = avatar_file;

    await this.usersRepository.create(user!);
  }
}

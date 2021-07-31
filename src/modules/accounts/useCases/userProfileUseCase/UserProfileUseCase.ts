import { inject, injectable } from "tsyringe";

import IUsersRepository from "@modules/accounts/repositories/IUsersRepository";
import User from "@modules/accounts/infra/typeorm/entities/User";
import { UserMap } from "@modules/accounts/mappers/UserMap";
import IUserResponseDTO from "@modules/accounts/DTOs/IUserResponseDTO";

@injectable()
export default class UserProfileUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {};
  
  async execute(id :string): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findById(id);

    const parsedUser = UserMap.toDTO(user);
    
    return parsedUser;
  }
}
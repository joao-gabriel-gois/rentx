import { getRepository, Repository } from "typeorm";

import ICreateUserTokensDTO from "@modules/accounts/DTOs/ICreateUserTokensDTO";
import IUsersTokensRepository from "@modules/accounts/repositories/IUsersTokensRepository";
import UserTokens from "../entities/UserTokens";


class UsersTokensRepository implements IUsersTokensRepository {

  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }
  

  async create({ user_id, expiration_date, refresh_token }: ICreateUserTokensDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      user_id,
      expiration_date,
      refresh_token
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findRefreshTokenByUserId(refresh_token: string, user_id: string): Promise<UserTokens | undefined> {
    const userToken = await this.repository.findOne({
      user_id,
      refresh_token
    });

    return userToken;
  }


  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

}

export default UsersTokensRepository;
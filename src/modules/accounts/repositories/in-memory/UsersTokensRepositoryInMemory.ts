import ICreateUserTokensDTO from "@modules/accounts/DTOs/ICreateUserTokensDTO";
import UserTokens from "@modules/accounts/infra/typeorm/entities/UserTokens";
import IUsersTokensRepository from "../IUsersTokensRepository";


export default class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  
  private usersTokensRepository: UserTokens[];

  constructor() {
    this.usersTokensRepository = [];
  }


  async create({ user_id, expiration_date, refresh_token }: ICreateUserTokensDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      user_id,
      expiration_date,
      refresh_token
    });

    this.usersTokensRepository.push(userToken);

    return userToken;
  }

  async findRefreshTokenByUserId(refresh_token: string, user_id: string): Promise<UserTokens | undefined> {
    const userToken = this.usersTokensRepository.find(currentUserToken => (
      currentUserToken.user_id === user_id && currentUserToken.refresh_token === refresh_token
    ));

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userTokenIndex = this.usersTokensRepository.findIndex(userToken => userToken.id === id);

    this.usersTokensRepository.splice(userTokenIndex, 1);
  }

  async findByRefreshToken(refresh_token: string): Promise<UserTokens | undefined> {
    return this.usersTokensRepository.find(userToken => userToken.refresh_token === refresh_token);
  }

}
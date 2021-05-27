import ICreateUserTokensDTO from "../DTOs/ICreateUserTokensDTO";
import UserTokens from "../infra/typeorm/entities/UserTokens";

export default interface IUsersTokensRepository {
   create({ user_id, expiration_date, refresh_token}: ICreateUserTokensDTO): Promise<UserTokens>;
   findRefreshTokenByUserId(refresh_token: string, user_id: string): Promise<UserTokens | undefined>;
   deleteById(id: string): Promise<void>;
}

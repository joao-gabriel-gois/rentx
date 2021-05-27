import auth from '@config/auth';
import IUsersTokensRepository from '@modules/accounts/repositories/IUsersTokensRepository';
import IDateProvider from '@shared/container/providers/DateProvider/IDateProvider';
import AppError from '@shared/errors/AppError';
import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
export default class RefrehTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {};
  
  async execute(token: string): Promise<string> {
    const {
      refresh_token_secret,
      refresh_token_expires_in,    
    } = auth;

    const { email, sub: user_id } = verify(token, refresh_token_secret) as IPayload;

    const userToken = await this.usersTokensRepository.findRefreshTokenByUserId(token, user_id);

    if (!userToken) {
      throw new AppError('Refresh Token Mismatch! Token informed was not found for this user')
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign( { email }, refresh_token_secret, {
      subject: user_id,
      expiresIn: refresh_token_expires_in,
    });

    const expiration_date = this.dateProvider.addDaysFromNow(
      Number(refresh_token_expires_in.substring(0, 2))
    );

    await this.usersTokensRepository.create({
      user_id,
      expiration_date,
      refresh_token
    })

    return refresh_token;
  }
}
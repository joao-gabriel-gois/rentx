import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import auth from '@config/auth';
import IUsersTokensRepository from '@modules/accounts/repositories/IUsersTokensRepository';
import IDateProvider from '@shared/container/providers/DateProvider/IDateProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
export default class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {};

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    const {
      token_secret,
      token_expires_in,
      refresh_token_secret,
      refresh_token_expires_in
    } = auth;

    if (!user || !user!.id) {
      throw new AppError('Incorrect Email or password!');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Incorrect Email or password!');
    }

    // only for example, generated with md5, with this input: pudãoignitenode_ultrasecure_hash
    // it should be used with better input and saved in an .env variable
    const token = sign({}, token_secret , {
      subject: user.id,
      expiresIn: token_expires_in,
    });

    const expiration_date = this.dateProvider.addDaysFromNow(
      Number(refresh_token_expires_in.substring(0, 2))
    );

    const refresh_token = sign({ email }, refresh_token_secret, {
      subject: user.id,
      expiresIn: refresh_token_expires_in 
    }); 

    await this.usersTokensRepository.create({
      user_id: user.id!,
      expiration_date,
      refresh_token
    });
    
    return {
      user: {
        name: user.name,
        email: user.email
      }, 
      token,
      refresh_token
    };

  }

}

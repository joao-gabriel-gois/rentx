import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import AppError from "../../../../errors/AppError";
import IUsersRepository from "../../repositories/IUsersRepository";

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
}

@injectable()
export default class AuthenticateUserCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {};

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect!');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect!');
    }

    // only for example, generated from md5, with this input: pudãoignitenode_ultrasecure_hash
    // it should be used with better input and saved in an .env variable
    const token = sign({}, 'da63565f6491b91e8ce54011ce4d9ca6', {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      user: {
        name: user.name,
        email: user.email
      }, 
      token,
    }
  }
}
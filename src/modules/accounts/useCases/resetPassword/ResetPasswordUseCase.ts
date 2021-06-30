import IUsersRepository from "@modules/accounts/repositories/IUsersRepository";
import IUsersTokensRepository from "@modules/accounts/repositories/IUsersTokensRepository";
import IDateProvider from "@shared/container/providers/DateProvider/IDateProvider";
import AppError from "@shared/errors/AppError";
import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

interface IRequest {
  token: string;
  password: string;
}


@injectable()
export default class ResetPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository : IUsersTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {};

  async execute({ token, password}: IRequest) {
    const usersToken = await this.usersTokensRepository.findByRefreshToken(token);

    if (!usersToken) {
      throw new AppError('Token not found, not authorized to reset password!');
    }

    const isTokenExpired = this.dateProvider
      .comparePrecedenceBetweenDates(
        usersToken.expiration_date,
        new Date()
      );
    
    if (isTokenExpired) {
      throw new AppError('Session has ended: Expired Tokeb! Please authenticate again');
    }

    const user = await this.usersRepository.findById(usersToken.user_id);

    user!.password = await hash(password, 8);

    await this.usersRepository.createOrUpdate(user!);

    await this.usersTokensRepository.deleteById(usersToken.id);

  }
}
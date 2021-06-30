import { inject, injectable } from "tsyringe";
import { v4 as uuid } from 'uuid';
import { resolve } from 'path';

import IUsersRepository from "@modules/accounts/repositories/IUsersRepository";
import IUsersTokensRepository from "@modules/accounts/repositories/IUsersTokensRepository";
import AppError from "@shared/errors/AppError";
import IDateProvider from "@shared/container/providers/DateProvider/IDateProvider";
import IMailProvider from "@shared/container/providers/MailProvider/IMailProvider";

@injectable()
export default class SendForgotPasswordEmailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
    
  ) {};

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists!');
    }

    const token = uuid();
    const expiration_date = this.dateProvider.addHoursFromNow(3);

    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id!,
      expiration_date,
    });

    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgot-password.hbs'  
    );

    const variables = {
      name: user.name,
      link: `${process.env.API_TEST_BASE_URL}/password/reset?token=${token}`
    }

    await this.mailProvider.sendMail(
      email,
      'Recuperação de Senha',
      variables,
      templatePath
    );
  }
}
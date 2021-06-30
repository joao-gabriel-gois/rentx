import UsersRepositoryInMemory from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import UsersTokensRepositoryInMemory from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import IUsersRepository from "@modules/accounts/repositories/IUsersRepository";
import IUsersTokensRepository from "@modules/accounts/repositories/IUsersTokensRepository";
import IDateProvider from "@shared/container/providers/DateProvider/IDateProvider";
import DayjsDateProvider from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import IMailProvider from "@shared/container/providers/MailProvider/IMailProvider";
import MailProviderInMemory from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import AppError from "@shared/errors/AppError";
import SendForgotPasswordEmailUseCase from "./SendForgotPasswordEmailUseCase";


let usersRepository: IUsersRepository;
let usersTokensRepository: IUsersTokensRepository;

let dateProvider: IDateProvider;
let mailProvider: IMailProvider;

let sendForgotPasswordEmailUseCase: SendForgotPasswordEmailUseCase;

describe('Send Forgot Password Email', () => {

  beforeAll(async () => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();

    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider
    );
  });

  it('should be able to send a forgot password email to user', async () => {
    const sendMail = spyOn(mailProvider, 'sendMail');
   
    await usersRepository.createOrUpdate({
      email: 'test@rentx.dev',
      name: 'Tester',
      password: 'tester_123',
      driver_license: 'TEST-LICENSE'
    });

    await sendForgotPasswordEmailUseCase.execute('test@rentx.dev');

    expect(sendMail).toBeCalled();
    expect(sendMail).toBeCalledTimes(1);
  });

  it('should be able to generate a expiring token for forgot password link\'s availability', async () => {
    const emailToken = spyOn(usersTokensRepository, 'create');
   
    await usersRepository.createOrUpdate({
      email: 'test2@rentx.dev',
      name: 'Second Tester',
      password: 'tester2_123',
      driver_license: 'TEST-LICENSE-2'
    });

    await sendForgotPasswordEmailUseCase.execute('test2@rentx.dev');

    expect(emailToken).toBeCalled();
    expect(emailToken).toBeCalledTimes(1);
  });

  it('should not be able to send a forgot password email to a non-existing user', async () => {
    await expect(
      sendForgotPasswordEmailUseCase.execute('non-existing@email.test')
   ).rejects.toEqual(new AppError('User does not exists!'));
  });
});

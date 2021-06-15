import AppError from '@shared/errors/AppError';
import UsersRepositoryInMemory from '@modules/accounts/repositories/in-memory/UserRepositoryInMemory';

import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';
import RefreshTokenUserCase from './RefreshTokenUseCase';

import CreateUserUseCase from '../createUser/CreateUserUseCase';
import UsersTokensRepositoryInMemory from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import AuthenticateUserUseCase from '../authenticateUser/AuthenticateUserUseCase';


let usersRepository: UsersRepositoryInMemory;
let usersTokensRepository: UsersTokensRepositoryInMemory;

let dateProvider: DayjsDateProvider;

let refreshTokenUseCase: RefreshTokenUserCase;
let authenticateUserUsecase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

let tempToken: string;

describe('Refresh User Token', () => {
  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    
    
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUsecase = new AuthenticateUserUseCase(usersRepository, usersTokensRepository, dateProvider);
    refreshTokenUseCase = new RefreshTokenUserCase(usersTokensRepository, dateProvider);
  });

  it('should be able to refresh an user token', async () => {
    const userRequestData: ICreateUserDTO = {
      name: 'Create User Test',
      email: 'user@test.dev',
      driver_license: '0123456789',
      password: '123deoliveira4'
    };

    await createUserUseCase.execute(userRequestData);

    const user = await usersRepository.findByEmail(userRequestData.email);

    const authResult = await authenticateUserUsecase.execute({
      email: userRequestData.email,
      password: userRequestData.password
    }); 
    
    const previousRefreshTokenUserToken = await usersTokensRepository.findRefreshTokenByUserId(
      authResult.refresh_token,
      user!.id!
    );
    const refreshedTokenUserToken = await refreshTokenUseCase.execute(authResult.refresh_token);

    expect(previousRefreshTokenUserToken!.id === refreshedTokenUserToken!.id).toBeFalsy();
    expect(
      refreshedTokenUserToken
        .expiration_date
        .getTime()
    ).toBeGreaterThan(
      previousRefreshTokenUserToken!
        .expiration_date
        .getTime()
    );

    tempToken = previousRefreshTokenUserToken!.refresh_token;
  });

  it('should not be able to refresh token for a non registered token', async () => {
    await expect(async () => { 
      const refreshedTokenUserToken = await refreshTokenUseCase.execute(tempToken);
    }).rejects.toEqual(new AppError(
      'Refresh Token Mismatch! Token informed was not found for this user'
    ));
  })
});
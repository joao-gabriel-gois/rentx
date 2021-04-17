import AppError from '@errors/AppError';
import UsersRepositoryInMemory from '@modules/accounts/repositories/in-memory/UserRepositoryInMemory';

import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';
import User from '@modules/accounts/entities/User';

import CreateUserUseCase from '../createUser/CreateUserUseCase';
import AuthenticateUserUseCase from './AuthenticateUserUseCase';


let usersRepository: UsersRepositoryInMemory;
let authenticateUserUsecase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    authenticateUserUsecase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to authenticate an user', async () => {
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

    expect(authResult).toHaveProperty('token');
    expect(user).toEqual(
      expect.objectContaining(authResult.user)
    );
  });

  it('should not be able to authenticate an non-existing user', async () => {
    const userRequestData: ICreateUserDTO = {
      name: 'Create User Test',
      email: 'user@test.dev',
      driver_license: '0123456789',
      password: '123deoliveira4'
    };
    
    const nonExistingUser = new User();

    Object.assign(nonExistingUser, {...userRequestData});

    expect(async () => {
      await authenticateUserUsecase.execute({
        email: userRequestData.email,
        password: userRequestData.password
      });      
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with wrong email', () => {
    expect(async () => {
      await authenticateUserUsecase.execute({
        email: 'false@email.dev',
        password: 'any-password' // email is checked before
      });      
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with wrong password', async () => {
    const userRequestData: ICreateUserDTO = {
      name: 'Create User Test',
      email: 'user@test.dev',
      driver_license: '0123456789',
      password: '123deoliveira4'
    };

    await createUserUseCase.execute(userRequestData);

    expect(async () => {
      await authenticateUserUsecase.execute({
        email: userRequestData.email,
        password: '9876543210'
      });      
    }).rejects.toBeInstanceOf(AppError);
  });


});
import AppError from '@shared/errors/AppError';
import UsersRepositoryInMemory from '@modules/accounts/repositories/in-memory/UserRepositoryInMemory';

import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';

import CreateUserUseCase from './CreateUserUseCase';


let usersRepository: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });


  it('should be able to create an user', async () => {
    const userRequestData: ICreateUserDTO = {
      name: 'Create User Test',
      email: 'user@test.dev',
      driver_license: '0123456789',
      password: '123deoliveira4'
    };

    await createUserUseCase.execute(userRequestData);

    const user = await usersRepository.findByEmail(userRequestData.email);

    expect(user).toHaveProperty('id');
  });


  it('should not be able to create an user with another user email', async () => {
    const userRequestData: ICreateUserDTO = {
      name: 'Create User Test',
      email: 'user@test.dev',
      driver_license: '0123456789',
      password: '123deoliveira4'
    };

    await createUserUseCase.execute(userRequestData);

    expect(async () => {
      await createUserUseCase.execute(userRequestData);      
    }).rejects.toBeInstanceOf(AppError);
  });

});
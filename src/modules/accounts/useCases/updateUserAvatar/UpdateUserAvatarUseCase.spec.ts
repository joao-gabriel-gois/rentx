import UsersRepositoryInMemory from '@modules/accounts/repositories/in-memory/UserRepositoryInMemory';

import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';
import CreateUserUseCase from '../createUser/CreateUserUseCase';
import UpdateUserAvatarUseCase from './UpdateUserAvatarUseCase';


let usersRepository: UsersRepositoryInMemory;

let updateUserAvatarUseCase: UpdateUserAvatarUseCase;
let createUserUseCase: CreateUserUseCase;


describe('Update User Avatar', () => {
  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    
    createUserUseCase = new CreateUserUseCase(usersRepository);
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(usersRepository);
  });

  it('should be able to update user avatar', async () => {
    const userRequestData: ICreateUserDTO = {
      name: 'Create User Test',
      email: 'user@test.dev',
      driver_license: '0123456789',
      password: '123deoliveira4'
    };

    await createUserUseCase.execute(userRequestData);

    const user = await usersRepository.findByEmail(userRequestData.email);

    const userBefore = {
      ...user
    }; // Copy without referencing the same instance as from DB

    await updateUserAvatarUseCase.execute({
      user_id: user!.id!,
      avatar_file: 'new_avatar_file'
    });

    expect(userBefore!).not.toHaveProperty('avatar');
    expect(user!).toHaveProperty('avatar');
    expect(user!.avatar).toBe('new_avatar_file');
  });

});
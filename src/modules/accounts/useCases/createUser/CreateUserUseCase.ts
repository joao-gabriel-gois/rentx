import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';

interface IRequest extends ICreateUserDTO {};

@injectable()
export default class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {};
  
  async execute({
    name,
    email,
    driver_license,
    password
  }: IRequest): Promise<void> {
    const hasThisUser = await this.usersRepository.findByEmail(email);
    
    if (hasThisUser) {
      throw new AppError('User with this email already exists');
    }
    
    const passwordHash = await hash(password, 8);

    await this.usersRepository.createOrUpdate({
      name,
      email,
      driver_license,
      password: passwordHash
    });
  }

}
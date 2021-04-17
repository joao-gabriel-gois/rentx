import IUsersRepository from '../IUsersRepository';
import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';

import User from '@modules/accounts/entities/User';


export default class UsersRepositoryInMemory implements IUsersRepository {
  private usersRepository: User[];

  constructor() {
    this.usersRepository = [];
  }

  async create({driver_license, name, email, password}: ICreateUserDTO): Promise<void> {
    const user = new User();
    
    Object.assign(user, {
      driver_license,
      name,
      email,
      password
    });

    this.usersRepository.push(user);
  }


  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.usersRepository.find(user => user.email === email);

    return new Promise((resolve, reject) => {
      resolve(user);
    });
  }
  

  async findById(id: string): Promise<User | undefined> {
    const user = this.usersRepository.find(user => user.id === id);

    return new Promise((resolve, reject) => {
      resolve(user);
    });
  }

}

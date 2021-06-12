import IUsersRepository from '../IUsersRepository';
import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';

import User from '@modules/accounts/infra/typeorm/entities/User';


export default class UsersRepositoryInMemory implements IUsersRepository {
  private usersRepository: User[];

  constructor() {
    this.usersRepository = [];
  }

  async createOrUpdate(data: ICreateUserDTO): Promise<void> {
    const user = new User();
    
    if (!data.id) {
      // creation
      Object.assign(user, {
        ...data,
        start_date: new Date()
      });
      
      this.usersRepository.push(user);
    }
    else {
      // update
      Object.assign(user, data);

      const currentUserIndex = this.usersRepository.findIndex(currentUser => currentUser.id === data.id);
      this.usersRepository[currentUserIndex] = user;
    }
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

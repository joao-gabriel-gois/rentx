import { getRepository, Repository } from 'typeorm';
import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';
import User from '@modules/accounts/infra/typeorm/entities/User';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }
  
  async createOrUpdate({
    id,
    name,
    email,
    driver_license,
    password,
    avatar
  }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      id,
      name,
      email,
      driver_license,
      password,
      avatar
    });
    
    await this.repository.save(user);
  }
  
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.repository.findOne({ email });
    
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    // Find one accepts ID directly, that is, without being an object
    const user = await this.repository.findOne(id);

    return user;
  }
}

export default UsersRepository;
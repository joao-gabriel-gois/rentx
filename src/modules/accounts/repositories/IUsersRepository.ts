import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';
import User from '@modules/accounts/infra/typeorm/entities/User';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<void>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
}

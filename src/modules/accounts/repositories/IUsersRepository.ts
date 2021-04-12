import ICreateUserDTO from "../DTOs/ICreateUserDTO";
import User from "../entities/User";


export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<void>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
}
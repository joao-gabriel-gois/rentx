import { inject, injectable } from "tsyringe";
import AppError from "../../../../error/AppError";
import ICreateUserDTO from "../../DTOs/ICreateUserDTO";
import IUsersRepository from "../../repositories/IUsersRepository";

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
      throw new AppError('User with this username already exists');
    }

    await this.usersRepository.create({
      name,
      email,
      driver_license,
      password
    });
  }

}
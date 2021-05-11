import Rental from "@modules/rents/infra/typeorm/entities/Rental";
import IRentsRepository from "@modules/rents/repositories/IRentsRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export default class ListRentsByUserUseCase  {
  constructor(
    @inject('RentsRepository')
    private rentsRepository: IRentsRepository,
  ) {};

  async execute(user_id: string): Promise<Rental[]> {
    const rentsByUser = await this.rentsRepository.findAllByUserId(user_id);

    return rentsByUser;
  }

};
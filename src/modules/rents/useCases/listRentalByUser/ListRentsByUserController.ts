import { Request, Response } from "express";
import { container } from "tsyringe";
import ListRentsByUserUseCase from "./ListRentsByUserUseCase";


class ListRentsByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const listRentalByUserUseCase = container.resolve(ListRentsByUserUseCase);

    const rents = await listRentalByUserUseCase.execute(id);

    return response.json(rents);
  }
}

export { ListRentsByUserController };
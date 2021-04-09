import { Request, Response } from "express";
import { container } from "tsyringe";
import CreateUserUseCase from "./CreateUserUseCase";

export default class createUserController {

  async handle(request: Request, reponse: Response): Promise<Response> {
    const {
      name,
      email,
      driver_license,
      password
    } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name,
      email,
      driver_license,
      password
    });
    
    return reponse.status(201).send();
  }

}
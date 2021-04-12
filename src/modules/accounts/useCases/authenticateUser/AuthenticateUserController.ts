import { Request, Response } from "express";
import { container } from "tsyringe";
import AuthenticateUserCase from "./AuthenticateUserUseCase";

class AuthenticateUserController {

  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUserCase = container.resolve(AuthenticateUserCase);

    const sessionInfo = await authenticateUserCase.execute({ email, password });
    
    return response.json(sessionInfo);
  }

}

export { AuthenticateUserController };

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserUseCase from './AuthenticateUserUseCase';

class AuthenticateUserController {

  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const sessionInfo = await authenticateUserUseCase.execute({ email, password });
    
    const clientIp = request.ip.split(':')[request.ip.split(':').length - 1];

    console.log(`\nSession started from user with Email: ${
      email
    }, using IP: ${
      clientIp
    }\nReq Headers:\n${
      JSON.stringify(request.headers)
    }`);

    return response.json(sessionInfo);
  }

}

export { AuthenticateUserController };

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import RefreshTokenUseCase from './RefreshTokenUseCase';

class RefreshTokenController {

  async handle(request: Request, response: Response): Promise<Response> {
    const token = 
      request.body.token ||
      request.headers['x-access-token'] ||
      request.query.token;

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
    
    const refreshToken = await refreshTokenUseCase.execute(token);
    
    // const clientIp = request.ip.split(':')[request.ip.split(':').length - 1];
    // console.log(
    //   `Refresh Token request started from client using IP: ${
    //     clientIp
    //   }\nReq Headers:\n${
    //     JSON.stringify(request.headers)
    //   }`);

    return response.json(refreshToken);
  }

}

export { RefreshTokenController };

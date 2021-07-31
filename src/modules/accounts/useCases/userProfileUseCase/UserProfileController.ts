import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UserProfileUseCase from './UserProfileUseCase';

class UserProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    
    const profileUseCase = container.resolve(UserProfileUseCase);

    const profile = await profileUseCase.execute(id);
    
    return response.json(profile);
  }
}

export { UserProfileController };
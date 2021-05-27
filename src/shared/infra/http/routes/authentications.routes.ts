import { Router } from 'express';
import { AuthenticateUserController } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserController';
import { RefreshTokenController } from '@modules/accounts/useCases/refreshToken/RefreshTokenController';

const authenticationsRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

authenticationsRoutes.post('/sessions', authenticateUserController.handle);
authenticationsRoutes.post('/refresh-token', refreshTokenController.handle)

export { authenticationsRoutes };

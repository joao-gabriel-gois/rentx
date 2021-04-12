import { Router } from "express";
import { AuthenticateUserController } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";

const authenticationsRoutes = Router();

const authenticateUserController = new AuthenticateUserController();

authenticationsRoutes.post('/sessions', authenticateUserController.handle);

export { authenticationsRoutes };

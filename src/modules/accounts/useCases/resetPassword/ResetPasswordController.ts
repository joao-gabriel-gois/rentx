import { Request, Response } from "express";
import { container } from "tsyringe";
import ResetPasswordUseCase from "./ResetPasswordUseCase";


class ResetPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    let { token } = request.query;
    const { password } = request.body;
    
    token = String(token);

    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

    await resetPasswordUseCase.execute({ token, password });
    
    return response.json();
  }
}

export { ResetPasswordController };
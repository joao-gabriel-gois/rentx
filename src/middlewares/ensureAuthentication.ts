import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import AppError from "../errors/AppError";
import UsersRepository from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token Missing! You need to authenticate!', 401);
  }

  const [, token] = authHeader.split(' ');

  verify(token, 'da63565f6491b91e8ce54011ce4d9ca6');

  try {
    const { sub: user_id } = verify(
      token,
      'da63565f6491b91e8ce54011ce4d9ca6'
    ) as IPayload;

    const usersRepository = new UsersRepository();

    const user = usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists!', 401);
    }

    next();
  } catch (error) {
    throw new AppError('Invalid Token!', 401);
  }
}
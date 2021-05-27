import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import AppError from "@shared/errors/AppError";
import UsersRepository from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import auth from "@config/auth";
import UsersTokensRepository from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";

interface IPayload {
  sub: string;
}

export default async function ensureAuthentication(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  
  const usersTokensRepository = new UsersTokensRepository();

  if (!authHeader) {
    throw new AppError('Token Missing! You need to authenticate!', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(
      token,
      auth.refresh_token_secret
    ) as IPayload;

    const user = await usersTokensRepository.findRefreshTokenByUserId(token, user_id);

    if (!user) {
      throw new AppError('User does not exists!', 401);
    }

    request.user = {
      id: user_id
    };

    next();
  } catch (error) {
    throw new AppError('Invalid Token!', 401);
  }
}
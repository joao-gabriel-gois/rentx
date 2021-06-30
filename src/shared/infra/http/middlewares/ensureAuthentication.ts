import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import AppError from "@shared/errors/AppError";
import auth from "@config/auth";

interface IPayload {
  sub: string;
}

export default async function ensureAuthentication(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  
  if (!authHeader) {
    throw new AppError('Token Missing! You need to authenticate!', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(
      token,
      auth.token_secret
    ) as IPayload;

    request.user = {
      id: user_id
    };

    next();
  } catch (error) {
    throw new AppError('Invalid Token!', 401);
  }
}
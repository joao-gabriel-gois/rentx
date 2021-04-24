import UsersRepository from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import AppError from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";

export default async function checkUserPrivilegeLevel(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;

  const usersRepository = new UsersRepository();
  const user = await usersRepository.findById(id);

  if (!user?.admin) {
    throw new AppError('User isn\'t an Admin!');
  }

  return next();
}

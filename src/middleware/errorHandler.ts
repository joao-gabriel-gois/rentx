import { NextFunction, Request, Response } from "express";
import AppError from "../error/AppError";

export default function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: error.message,
    })
  }

  return response.status(500).json({
    error: error.message,
  });
}

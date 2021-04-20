import { NextFunction, Request, Response } from "express";
import AppError from "@shared/errors/AppError";

// why it is not working anymore when app is running inside docker?
// Need to figure out why!

export default async function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    })
  }

  return response.status(500).json({
    error: `Internal Server Error - ${error.message}`,
  });
}

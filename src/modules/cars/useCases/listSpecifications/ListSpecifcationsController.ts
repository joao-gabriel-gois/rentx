import { Request, Response } from "express";
import ListSpecificationsUseCase from "./ListSpecificationsUseCase";

export default class ListSpecificationsController {
  constructor(private listSpecificationsUseCase: ListSpecificationsUseCase) {};

  async handle(request: Request, response: Response): Promise<Response> {
    const specifications = await this.listSpecificationsUseCase.execute();
  
    return response.json(specifications);
  }
}
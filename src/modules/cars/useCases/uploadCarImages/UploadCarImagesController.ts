import { Request, Response } from "express";
import { container } from "tsyringe";
import UploadCarImagesUseCase from "./UploadCarImagesUseCase";

interface IFile {
  filename: string;
}

class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const images = request.files as IFile[];

    const uploadCarUseCase = container.resolve(UploadCarImagesUseCase);

    const images_names = images.map(file => file.filename);

    await uploadCarUseCase.execute({
      car_id: id,
      images_names,
    });

    return response.status(201).send();
  }
}

export { UploadCarImagesController };

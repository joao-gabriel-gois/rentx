import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSpecificationUseCase from './CreateCarSpecificationUseCase';

class CreateCarSpecificationController {

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { specifications_id } = request.body;

    const createSpecificationUseCase = container.resolve(CreateSpecificationUseCase);

    const specification = await createSpecificationUseCase.execute({
      car_id: id,
      specifications_id
    });
  
    return response.status(201).json(specification);
  }

}

export { CreateCarSpecificationController };
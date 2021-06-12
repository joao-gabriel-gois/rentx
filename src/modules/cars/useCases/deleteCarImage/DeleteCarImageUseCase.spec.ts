import ICreateCarDTO from '@modules/cars/DTOs/ICreateCarDTO';
import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';
import CarsImagesRepositoryInMemory from '@modules/cars/repositories/in-memory/CarsImagesRepositoryInMemory';
import CarsRepositoryInMemory from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import AppError from '@shared/errors/AppError';
import { createFile, deleteFile, ICreateFakeFileResponse } from '@utils/file';
import CreateCarUseCase from '../createCar/CreateCarUseCase';
import UploadCarImagesUseCase from '../uploadCarImages/UploadCarImagesUseCase';
import DeleteCarImageUseCase from './DeleteCarImageUseCase';

let carsRepository: CarsRepositoryInMemory;
let carsImagesRepository: ICarsImagesRepository;

let createCarUseCase: CreateCarUseCase;
let uploadCarImagesUseCase: UploadCarImagesUseCase;
let deleteCarImageUseCase: DeleteCarImageUseCase;

let residualFile: ICreateFakeFileResponse;

describe('Delete Cars Image', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    carsImagesRepository = new CarsImagesRepositoryInMemory();
    
    createCarUseCase = new CreateCarUseCase(carsRepository);
    uploadCarImagesUseCase = new UploadCarImagesUseCase(carsRepository, carsImagesRepository);
    deleteCarImageUseCase = new DeleteCarImageUseCase(carsRepository, carsImagesRepository);
  });

  afterAll(async () => {
    if (residualFile) await deleteFile(residualFile.path);
  });

  it('should be able to delete a car image', async () => {
    const carRequestData: ICreateCarDTO = {
        name: 'test',
        description: 'test description',
        daily_rate: 100,
        license_plate: 'fake-lincense-plate',
        fine_amount: 60,
        brand: 'Toyota',
        category_id: 'fake-uuid'
    };

    const car = await createCarUseCase.execute(carRequestData);
    const fakeImage1 = createFile({ folder: 'cars', filename: 'test_1' });
    const fakeImage2 = createFile({ folder: 'cars', filename: 'test_2' });

    await uploadCarImagesUseCase.execute({
      car_id: car.id,
      images_names: [
        fakeImage1.filename,
        fakeImage2.filename,
      ]
    });

    const carImagesBeforeDeleting = await carsImagesRepository.findByCarId(car.id);

    await deleteCarImageUseCase.execute({
      car_id: car.id,
      image_name: fakeImage1.filename
    })
    
    const carImagesAfterDeleting = await carsImagesRepository.findByCarId(car.id);

    expect(carImagesAfterDeleting.length).toBe(1);
    expect(carImagesBeforeDeleting.length).toBe(2);

    expect(carImagesAfterDeleting).toEqual([
      expect.objectContaining({
        image_name: fakeImage2.filename,
      }),
    ]);

    expect(carImagesBeforeDeleting).toEqual([
      expect.objectContaining({
        image_name: fakeImage1.filename,
      }),
      expect.objectContaining({
        image_name: fakeImage2.filename,
      }),
    ]);

    residualFile = fakeImage2;
  });

  it('should not be able to delete a non existing car image', async () => {
    await expect(
      deleteCarImageUseCase.execute({
        car_id: 'non-existing-car-id',
        image_name: 'whatever'
      })
    ).rejects.toEqual(new AppError('Car does not exists!', 404));
  });

});

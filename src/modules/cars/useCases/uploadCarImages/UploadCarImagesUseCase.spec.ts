import ICreateCarDTO from '@modules/cars/DTOs/ICreateCarDTO';
import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';
import CarsImagesRepositoryInMemory from '@modules/cars/repositories/in-memory/CarsImagesRepositoryInMemory';
import CarsRepositoryInMemory from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import AppError from '@shared/errors/AppError';
import CreateCarUseCase from '../createCar/CreateCarUseCase';
import UploadCarImagesUseCase from './UploadCarImagesUseCase';


let carsRepository: CarsRepositoryInMemory;
let carsImagesRepository: ICarsImagesRepository;

let createCarUseCase: CreateCarUseCase;
let uploadCarImagesUseCase: UploadCarImagesUseCase;

describe('Upload Car Images', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    carsImagesRepository = new CarsImagesRepositoryInMemory();
    
    createCarUseCase = new CreateCarUseCase(carsRepository);
    uploadCarImagesUseCase = new UploadCarImagesUseCase(carsRepository, carsImagesRepository);
  });

  it('should be able to upload car images', async () => {
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
    
    await uploadCarImagesUseCase.execute({
      car_id: car.id,
      images_names: [
        'test_1',
        'test_2',
      ]
    });

    const carImages = await carsImagesRepository.findByCarId(car.id);

    expect(carImages).toEqual([
      expect.objectContaining({
        image_name: 'test_1',
      }),
      expect.objectContaining({
        image_name: 'test_2',
      }),
    ]);

  });

  it('should not be able to upload images for a non existing car', async () => {
    await expect(
      uploadCarImagesUseCase.execute({
        car_id: 'non-existing-car-id',
        images_names: ['whatever']
      })
    ).rejects.toEqual(new AppError('Car does not exists!', 404));
  });

});

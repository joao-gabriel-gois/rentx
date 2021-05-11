import User from "@modules/accounts/infra/typeorm/entities/User";
import ICreateRentalDTO from "@modules/rents/DTOs/ICreateRentalDTO";
import IRentsRepository from "@modules/rents/repositories/IRentsRepository";
import Rental from "../../infra/typeorm/entities/Rental";


export default class RentsRepositoryInMemory implements IRentsRepository {
  private rentsRepository: Rental[];
  
  constructor() {
    this.rentsRepository = [];
  }
  
  async createOrUpdate(data: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();
    
    if (!data.id) {
      // creation
      Object.assign(rental, {
        ...data,
        start_date: new Date()
      });
      
      this.rentsRepository.push(rental);
    }
    else {
      // update
      console.log(rental.id, 'before assigning');
      Object.assign(rental, data);
      console.log(rental.id, 'after assigning');

      const currentRentalIndex = this.rentsRepository.findIndex(currentRental => currentRental.id === data.id);
      this.rentsRepository[currentRentalIndex] = rental;
    }
     
    return rental;
  }

  async findById(rental_id: string): Promise<Rental | undefined> {
    const rental = this.rentsRepository.find(rental => rental.id === rental_id);

    return rental;
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental | undefined> {
    const rental = this.rentsRepository.find(rental => (
      rental.car_id === car_id && !rental.end_date
    ));

    return rental;
  }

  async findOpenRentalByUserId(user_id: string): Promise<Rental | undefined> {
    const rental = this.rentsRepository.find(rental => (
      rental.user_id === user_id && !rental.end_date
    ));

    return rental;
  }

  async findAllByUserId(user_id: string): Promise<Rental[]> {
    const rentals = this.rentsRepository.filter(rental => rental.user_id === user_id);

    return rentals;
  }

}

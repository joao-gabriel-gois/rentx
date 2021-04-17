import { getRepository, Repository } from 'typeorm';
import Specification from '@modules/cars/entities/Specification';
import ICreateSpecificationDTO from '@modules/cars/DTOs/ICreateSpecificationDTO';
import ISpecificationsRepository from '../ISpecificationsRepository';

export default class SpecificationsRepository implements ISpecificationsRepository {
  private repository: Repository<Specification>;

  constructor () {
    this.repository = getRepository(Specification);
  }
  
  async create({ name, description }: ICreateSpecificationDTO): Promise<void> {
    const specification = this.repository.create({
      name,
      description
    });
    
    await this.repository.save(specification);
  }
  
  async list(): Promise<Specification[]> {
    return await this.repository.find();
  }
  
  async findByName(name: string): Promise<Specification | undefined> {
    const specification = await this.repository.findOne({ name });
    
    return specification;
  }
  
}
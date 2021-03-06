import { getRepository, In, Repository } from 'typeorm';
import Specification from '@modules/cars/infra/typeorm/entities/Specification';
import ICreateSpecificationDTO from '@modules/cars/DTOs/ICreateSpecificationDTO';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';

export default class SpecificationsRepository implements ISpecificationsRepository {
  private repository: Repository<Specification>;

  constructor () {
    this.repository = getRepository(Specification);
  }
  async create({ name, description }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = this.repository.create({
      name,
      description
    });
    
    await this.repository.save(specification);

    return specification;
  }
  
  async list(): Promise<Specification[]> {
    return await this.repository.find();
  }
  
  async findByName(name: string): Promise<Specification | undefined> {
    const specification = await this.repository.findOne({ name });
    
    return specification;
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    return await this.repository.findByIds(ids);
  }
  
  
}
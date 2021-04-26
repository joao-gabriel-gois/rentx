import ICreateSpecificationDTO from "@modules/cars/DTOs/ICreateSpecificationDTO";
import Specification from "@modules/cars/infra/typeorm/entities/Specification";
import ISpecificationsRepository from "../ISpecificationsRepository";


export default class SpecificationsRepositoryInMemory implements ISpecificationsRepository {
  private specificationsRepository: Specification[];

  constructor() {
    this.specificationsRepository = [];
  }
  
  async create({ name, description }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification();
    
    Object.assign(specification, {
      name,
      description,
    });
    
    this.specificationsRepository.push(specification);

    return specification;
  }
  
  async list(): Promise<Specification[]> {
    return new Promise((resolve, reject) => {
      resolve(this.specificationsRepository);
    });
  }
  
  async findByName(name: string): Promise<Specification | undefined> {
    return new Promise((resolve, reject) => {
      const specification = this.specificationsRepository.find(specification => specification.name === name);
      
      resolve(specification);
    });
  }
  
  async findByIds(ids: string[]): Promise<Specification[]> {
    const specifications = this.specificationsRepository.filter(specification =>
      ids.includes(specification.id!)
    );

    return specifications;
  }
  
}

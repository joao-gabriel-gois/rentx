import { getRepository, Repository } from "typeorm";
import Specification from "../../entities/Specification";
import ICreateSpecificationDTO from "../DTOs/ICreateSpecificationDTO";
import ISpecificationsRepository from "../ISpecificationsRepository";

export default class SpecificationsRepository implements ISpecificationsRepository {
  private repository: Repository<Specification>;

  constructor () {
    this.repository = getRepository(Specification);
  }
  
  // Singleton {
  private static INSTANCE: SpecificationsRepository;
  
  public static getInstance(): SpecificationsRepository {
    if(!SpecificationsRepository.INSTANCE) {
      SpecificationsRepository.INSTANCE = new SpecificationsRepository();
    }
    
    return SpecificationsRepository.INSTANCE;
  }
  // }
  
  create({ name, description }: ICreateSpecificationDTO): Specification {
    const specification = this.repository.create({
      name,
      description
    });
    
    return specification;
  }
  
  async list(): Promise<Specification[]> {
    return await this.repository.find();
  }
  
  async findByName(name: string): Promise<Specification | undefined> {
    const specification = await this.repository.findOne({ name });
    
    return specification;
  }
  
  async save(specification: Specification): Promise<void> {
    await this.repository.save(specification);
  }
}
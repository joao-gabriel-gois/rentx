import Specification from "../../models/Specification";
import ICreateSpecificationDTO from "../DTOs/ICreateSpecificationDTO";
import ISpecificationsRepository from "../ISpecificationsRepository";

export default class SpecificationsRepository implements ISpecificationsRepository {
  private specifications: Specification[];

  constructor() {
    this.specifications = [];
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
  
  create({ name, description }: ICreateSpecificationDTO): void {
    const specification = new Specification();
    
    Object.assign(specification, {
      name,
      description,
      created_at: new Date(),
    });
    
    this.specifications.push(specification);
  }
  
  list(): Specification[] {
    return this.specifications;
  }
  
  findByName(name: string): Specification | undefined {
    const specification = this.specifications.find(
      specification => specification.name === name
    );

    return specification;
  }
}
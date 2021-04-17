import Specification from '../entities/Specification';
import ICreateSpecificationDTO from '../DTOs/ICreateSpecificationDTO';

export default interface ISpecificationsRepository {
  create({name, description}: ICreateSpecificationDTO): Promise<void>;
  list(): Promise<Specification[]>;
  findByName(name: string): Promise<Specification | undefined>;
}

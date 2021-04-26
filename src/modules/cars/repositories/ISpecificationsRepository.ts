import Specification from '../entities/Specification';
import ICreateSpecificationDTO from '../DTOs/ICreateSpecificationDTO';
import Specification from '../infra/typeorm/entities/Specification';
import Specification from '../infra/typeorm/entities/Specification';

export default interface ISpecificationsRepository {
  create({name, description}: ICreateSpecificationDTO): Promise<Specification>;
  list(): Promise<Specification[]>;
  findByName(name: string): Promise<Specification | undefined>;
  findByIds(ids: string[]): Promise<Specification[]>;
}

import Specification from "../entities/Specification";
import ICreateSpecificationDTO from "./DTOs/ICreateSpecificationDTO";

export default interface ISpecificationsRepository {
  create({name, description}: ICreateSpecificationDTO): Specification;
  list(): Promise<Specification[]>;
  findByName(name: string): Promise<Specification | undefined>;
  save(category: Specification): Promise<void>;
}

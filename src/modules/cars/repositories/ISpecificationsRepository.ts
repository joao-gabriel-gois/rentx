import Category from "../models/Category";
import Specification from "../models/Specification";
import ICreateSpecificationDTO from "./DTOs/ICreateSpecificationDTO";

export default interface ISpecificationsRepository {
  create({name, description}: ICreateSpecificationDTO): void;
  list(): Category[];
  findByName(name: string): Specification | undefined;
}

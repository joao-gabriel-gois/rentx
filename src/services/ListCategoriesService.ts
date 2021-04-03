import Category from "../models/Category";
import CategoriesRepository from "../repositories/CategoriesRepository";

export default class ListCategoriesService {
  private categoriesRepository;

  constructor(categoriesRepository: CategoriesRepository) {
    this.categoriesRepository = categoriesRepository;
  }

  execute(): Category[]{
    const categories = this.categoriesRepository.list();
    return categories;
  }
}

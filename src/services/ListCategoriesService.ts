import Category from "../models/Category";
import ICategoriesRepository from "../repositories/ICategoriesRepository";

export default class ListCategoriesService {
  private categoriesRepository;

  constructor(categoriesRepository: ICategoriesRepository) {
    this.categoriesRepository = categoriesRepository;
  }

  execute(): Category[]{
    const categories = this.categoriesRepository.list();
    return categories;
  }
}

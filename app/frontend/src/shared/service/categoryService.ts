import {
  ICategory,
  ICategoryPayload,
  IUploadCSVResponse,
} from "../interface/interface.ts";
import { BaseService } from "./baseService.ts";

export class CategoryService extends BaseService {
  private static instance: CategoryService;

  static getInstance() {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }

    return CategoryService.instance;
  }

  async getAll(): Promise<ICategory[]> {
    const response = await fetch(`${this.BASE_URL}/categories`, {
      method: "GET",
      headers: this.headers,
    });

    return this.handleResponse<ICategory[]>(response);
  }

  async create(category: ICategoryPayload): Promise<ICategory> {
    const payload = {
      name: category.name,
      discount_percent: category.discount_percent || 0,
    };

    const response = await fetch(`${this.BASE_URL}/categories`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    return this.handleResponse<ICategory>(response);
  }

  async update(
    categoryId: number,
    category: ICategoryPayload
  ): Promise<ICategory> {
    const response = await fetch(`${this.BASE_URL}/categories/${categoryId}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(category),
    });

    return this.handleResponse<ICategory>(response);
  }

  async uploadCSV(file: File): Promise<IUploadCSVResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.BASE_URL}/categories/upload-csv/`, {
      method: "POST",
      body: formData,
    });

    return this.handleResponse<IUploadCSVResponse>(response);
  }

  async delete(categoryId: number): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/categories/${categoryId}`, {
      method: "DELETE",
      headers: this.headers,
    });
    return this.handleResponse<void>(response);
  }
}

export const categoryService = CategoryService.getInstance();

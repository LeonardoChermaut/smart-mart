import {
  IProduct,
  IProductCreatePayload,
  IUploadCSVResponse,
} from "../interface/interface.ts";
import { BaseService } from "./baseService.ts";

export class ProductService extends BaseService {
  private static instance: ProductService;

  static getInstance() {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }

    return ProductService.instance;
  }

  async getAll(skip = 0, limit = 50): Promise<IProduct[]> {
    const response = await fetch(
      `${this.BASE_URL}/products/?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: this.headers,
      }
    );

    return this.handleResponse<IProduct[]>(response);
  }

  async create(product: IProductCreatePayload): Promise<IProduct> {
    const response = await fetch(`${this.BASE_URL}/products`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(product),
    });

    return this.handleResponse<IProduct>(response);
  }

  async delete(productId: number): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: this.headers,
    });

    return this.handleResponse<void>(response);
  }

  async update(product: IProduct): Promise<IProduct> {
    const response = await fetch(`${this.BASE_URL}/products/${product.id}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(product),
    });

    return this.handleResponse<IProduct>(response);
  }

  async uploadCSV(file: File): Promise<IUploadCSVResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.BASE_URL}/products/upload-csv/`, {
      method: "POST",
      body: formData,
    });

    return this.handleResponse<IUploadCSVResponse>(response);
  }

  async exportCSV(): Promise<Blob> {
    const response = await fetch(`${this.BASE_URL}/products/export-csv`);
    if (!response.ok) {
      throw new Error("Failed to export products");
    }

    return response.blob();
  }
}

export const productService = ProductService.getInstance();

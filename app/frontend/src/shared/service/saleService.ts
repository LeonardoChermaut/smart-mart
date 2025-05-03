import {
  ISale,
  ISaleAnalyticsParams,
  ISalesAnalytics,
  IUploadCSVResponse,
} from "../interface/interface.ts";
import { BaseService } from "./baseService.ts";

export class SalesService extends BaseService {
  private static instance: SalesService;

  static getInstance() {
    if (!SalesService.instance) {
      SalesService.instance = new SalesService();
    }

    return SalesService.instance;
  }

  async getAll(skip = 0, limit = 50): Promise<ISale[]> {
    const response = await fetch(
      `${this.BASE_URL}/sales/?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: this.headers,
      }
    );

    return this.handleResponse<ISale[]>(response);
  }

  async getAnalytics(
    params?: ISaleAnalyticsParams
  ): Promise<ISalesAnalytics[]> {
    const url = new URL(`${this.BASE_URL}/sales/analytics`);

    if (params?.year) {
      url.searchParams.append("year", params.year.toString());
    }
    if (params?.skip) {
      url.searchParams.append("skip", params.skip.toString());
    }
    if (params?.limit) {
      url.searchParams.append("limit", params.limit.toString());
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.headers,
    });

    return this.handleResponse<ISalesAnalytics[]>(response);
  }

  async exportAnalyticsExcel({
    year,
    skip,
    limit,
  }: ISaleAnalyticsParams): Promise<Blob> {
    const url = new URL(`${this.BASE_URL}/sales/analytics/export-excel`);

    if (year) {
      url.searchParams.append("year", year.toString());
    }
    if (skip) {
      url.searchParams.append("skip", skip.toString());
    }
    if (limit) {
      url.searchParams.append("limit", limit.toString());
    }

    const response = await fetch(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error("Failed to export products");
    }

    return response.blob();
  }

  async create(sale: Omit<ISale, "id">): Promise<ISale> {
    const response = await fetch(`${this.BASE_URL}/sales/`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(sale),
    });

    return this.handleResponse<ISale>(response);
  }

  async delete(saleId: number): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/sales/${saleId}`, {
      method: "DELETE",
      headers: this.headers,
    });

    return this.handleResponse<void>(response);
  }

  async update(sale: Partial<ISale>): Promise<ISale> {
    const response = await fetch(`${this.BASE_URL}/sales/${sale.id}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(sale),
    });

    return this.handleResponse<ISale>(response);
  }

  async uploadCSV(file: File): Promise<IUploadCSVResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.BASE_URL}/sales/upload-csv/`, {
      method: "POST",
      body: formData,
    });

    return this.handleResponse<IUploadCSVResponse>(response);
  }
}

export const salesService = SalesService.getInstance();

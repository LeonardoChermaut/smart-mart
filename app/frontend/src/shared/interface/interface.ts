// Category interface

export interface ICategory {
  id: number;
  name: string;
  discount_percent: number;
}

export interface ICategoryPayload extends Omit<ICategory, "id"> {}

export interface CategoryCreatePayload {
  name: string;
  discount_percent: number;
}

// Product interface

export interface IProduct {
  id: number;
  name: string;
  base_price: number;
  current_price: number;
  category_id?: number;
  category?: ICategory;
}

export interface IProductCreatePayload {
  name: string;
  category_id?: number;
  base_price: number;
}

//  Sale interface

export interface ISale {
  id: number;
  product_id: number;
  date: string;
  quantity: number;
  total_price: number;
  product: IProduct;
}

export interface ISalesAnalytics {
  month: string;
  total_sales: number;
  total_quantity: number;
  profit: number;
}

export interface ISaleAnalyticsParams {
  year?: string | number;
  skip?: number;
  limit?: number;
}

export interface IUploadCSVResponse {
  message: string;
  records_processed: number;
}

// Category interfaces
export interface ICategory {
  id: number;
  name: string;
  discount_percent: number;
  created_at?: string;
  updated_at?: string;
}

export interface ICategoryPayload
  extends Omit<ICategory, "id" | "created_at" | "updated_at"> {}

// Product interfaces
export interface IProduct {
  id: number;
  name: string;
  description: string;
  base_price: number;
  current_price: number;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  category?: ICategory;
}

export interface IProductCreatePayload
  extends Omit<
    IProduct,
    "id" | "current_price" | "created_at" | "updated_at" | "category"
  > {
  base_price: number;
}

export interface IProductUpdatePayload extends Partial<IProductCreatePayload> {}

export interface IProductListFilter {
  categoryId?: number;
  searchQuery?: string;
}

// Sale interfaces
export interface ISale {
  id: number;
  product_id: number;
  date: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: IProduct;
}

export interface ISaleCreatePayload {
  product_id: number;
  date: string;
  quantity: number;
  unit_price: number;
}

export interface ISalesAnalytics {
  month: string;
  total_sales: number;
  total_quantity: number;
  profit: number;
  profit_margin?: number;
}

export interface ISaleAnalyticsParams {
  year?: number;
  month?: number;
  category_id?: number;
  skip?: number;
  limit?: number;
}

export interface IUploadCSVResponse {
  message: string;
  records_processed: number;
}

// Tipos auxiliares
export type Decimal = number;
export interface ICategory {
  id: number;
  name: string;
  discount_percent: number;
  created_at?: string;
  updated_at?: string;
}

export interface ICategoryPayload
  extends Omit<ICategory, "id" | "created_at" | "updated_at"> {}

// Product interfaces
export interface IProduct {
  id: number;
  name: string;
  description: string;
  base_price: number;
  current_price: number;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  category?: ICategory;
}

export interface IProductCreatePayload
  extends Omit<
    IProduct,
    "id" | "current_price" | "created_at" | "updated_at" | "category"
  > {
  base_price: number;
}

export interface IProductUpdatePayload extends Partial<IProductCreatePayload> {}

export interface IProductListFilter {
  categoryId?: number;
  searchQuery?: string;
}

// Sale interfaces
export interface ISale {
  id: number;
  product_id: number;
  date: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: IProduct;
}

export interface ISaleCreatePayload {
  product_id: number;
  date: string;
  quantity: number;
  unit_price: number;
}

export interface ISalesAnalytics {
  month: string;
  total_sales: number;
  total_quantity: number;
  profit: number;
  profit_margin?: number;
}

export interface ISaleAnalyticsParams {
  year?: number;
  month?: number;
  category_id?: number;
  skip?: number;
  limit?: number;
}

export interface IUploadCSVResponse {
  message: string;
  records_processed: number;
}

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
  description: string | null;
  base_price: number | string;
  current_price: number | string;
  category_id: number | null;
  created_at?: string;
  updated_at?: string;
  category?: ICategory;
}

export interface IProductCreatePayload
  extends Omit<
    IProduct,
    "id" | "current_price" | "created_at" | "updated_at" | "category"
  > {
  base_price: number | string;
}

export interface IProductUpdatePayload extends Partial<IProductCreatePayload> {}

export interface IProductListFilter {
  categoryId?: number | null;
  searchQuery?: string;
}

// Sale interfaces
export interface ISale {
  id: number;
  product_id: number;
  date: string;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
  product: IProduct;
}

export interface ISaleCreatePayload {
  product_id: number;
  date: string;
  quantity: number;
  unit_price: number | string;
}

export interface ISalesAnalytics {
  month: string; // Formato "YYYY-MM"
  total_sales: number;
  total_quantity: number;
  profit: number;
  profit_margin?: number; // Adicionado para cálculo opcional
}

export interface ISaleAnalyticsParams {
  year?: number; // Alterado para number (não string)
  month?: number; // Adicionado para filtro por mês
  category_id?: number | null; // Adicionado para filtro por categoria
  skip?: number;
  limit?: number;
}

export interface IUploadCSVResponse {
  message: string;
  records_processed: number;
}

// Tipos auxiliares
export type Decimal = number | string; // Para lidar com valores decimais do backend// Category interfaces
export interface ICategory {
  id: number;
  name: string;
  discount_percent: number;
  created_at?: string; // Adicionado para refletir o backend
  updated_at?: string; // Adicionado para refletir o backend
}

export interface ICategoryPayload
  extends Omit<ICategory, "id" | "created_at" | "updated_at"> {}

// Product interfaces
export interface IProduct {
  id: number;
  name: string;
  description: string | null;
  base_price: number | string; // String para Decimal do backend
  current_price: number | string;
  category_id: number | null;
  created_at?: string;
  updated_at?: string;
  category?: ICategory; // Relacionamento opcional
}

export interface IProductCreatePayload
  extends Omit<
    IProduct,
    "id" | "current_price" | "created_at" | "updated_at" | "category"
  > {
  base_price: number | string;
}

export interface IProductUpdatePayload extends Partial<IProductCreatePayload> {}

export interface IProductListFilter {
  categoryId?: number | null;
  searchQuery?: string;
}

// Sale interfaces
export interface ISale {
  id: number;
  product_id: number;
  date: string;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
  product: IProduct;
}

export interface ISaleCreatePayload {
  product_id: number;
  date: string;
  quantity: number;
  unit_price: number | string;
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
  category_id?: number | null;
  skip?: number;
  limit?: number;
}

export interface IUploadCSVResponse {
  message: string;
  records_processed: number;
}

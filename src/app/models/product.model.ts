export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  stock: number;
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  category?: string;
  stock?: number;
  status?: 'active' | 'inactive' | 'draft';
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

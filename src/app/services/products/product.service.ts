import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base-api.service';
import { Product, CreateProductRequest, UpdateProductRequest, ProductListResponse } from '../../models/product.model';
import { ApiResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseApiService {

  private readonly endpoint = '/products';

  /**
   * Get all products with pagination and filters
   */
  getProducts(
    page: number = 1, 
    limit: number = 10, 
    search?: string, 
    category?: string,
    status?: string
  ): Observable<ApiResponse<ProductListResponse>> {
    let queryParams = `?page=${page}&limit=${limit}`;
    
    if (search) {
      queryParams += `&search=${encodeURIComponent(search)}`;
    }
    if (category) {
      queryParams += `&category=${encodeURIComponent(category)}`;
    }
    if (status) {
      queryParams += `&status=${status}`;
    }
    
    return this.get<ApiResponse<ProductListResponse>>(`${this.endpoint}${queryParams}`);
  }

  /**
   * Get product by ID
   */
  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.get<ApiResponse<Product>>(`${this.endpoint}/${id}`);
  }

  /**
   * Create new product
   */
  createProduct(productData: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.post<ApiResponse<Product>>(this.endpoint, productData);
  }

  /**
   * Update product
   */
  updateProduct(id: number, productData: UpdateProductRequest): Observable<ApiResponse<Product>> {
    return this.put<ApiResponse<Product>>(`${this.endpoint}/${id}`, productData);
  }

  /**
   * Delete product
   */
  deleteProduct(id: number): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(`${this.endpoint}/${id}`);
  }

  /**
   * Upload product images
   */
  uploadProductImages(id: number, files: File[]): Observable<ApiResponse<any>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });
    
    return this.post<ApiResponse<any>>(`${this.endpoint}/${id}/images`, formData);
  }

  /**
   * Get product categories
   */
  getCategories(): Observable<ApiResponse<string[]>> {
    return this.get<ApiResponse<string[]>>(`${this.endpoint}/categories`);
  }

  /**
   * Update product stock
   */
  updateStock(id: number, quantity: number, operation: 'add' | 'subtract' | 'set'): Observable<ApiResponse<Product>> {
    return this.put<ApiResponse<Product>>(`${this.endpoint}/${id}/stock`, {
      quantity,
      operation
    });
  }
}

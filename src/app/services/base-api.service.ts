import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ConfigService } from './config/config.service';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  
  protected baseUrl: string;
  private configService = inject(ConfigService);

  constructor(protected http: HttpClient) {
    // Usar ConfigService si está disponible, sino usar environment
    this.baseUrl = environment.apiUrl;
    console.log('BaseApiService initialized with URL:', this.baseUrl);

  }

  /**
   * Get headers with authorization token
   */
  protected getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Handle HTTP errors
   */
  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor. Verifica que la API esté ejecutándose.';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint no encontrado. Verifica la URL de la API.';
      } else {
        errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => errorMessage);
  }

  /**
   * Generic GET request
   */
  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic POST request
   */
  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic PUT request
   */
  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic DELETE request
   */
  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }
}

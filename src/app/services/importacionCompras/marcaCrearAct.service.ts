import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { environment } from '../../../environments/environment';
import { user } from '../../shared/data/user';

@Injectable({
  providedIn: 'root'
})
export class MarcaCrearActService extends BaseApiService {

  private readonly endpoint = environment.apiUrl + '/ImportCompras/proteccionMarcas/crearact/';

  constructor(http: HttpClient) {
    super(http);
  }

  /**
     * Obtener datos de sesión del usuario actual
     */
  getUserSessionToken() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token') || '';
    return token;
  }

  getUserSessionData() {
    const user = localStorage.getItem('user') || '';
    let userData = null;
    try {
      if (user) {
        userData = JSON.parse(user);
      }
    } catch (error) {

      userData = user; // Si no es JSON, usar como string
    }
    return userData;
  }

  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.getUserSessionToken()}`
  });

  Guardar_datos(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Guardar_datos", data, { headers: this.headers });
  }
  Cargar_Tipos_Marcas(): Observable<any> {
    return this.http.post<any>(this.endpoint + "Cargar_Tipos_Marcas", { headers: this.headers });
  }
  Cargar_Marcas(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "Cargar_Marcas", data, { headers: this.headers });
  }
}

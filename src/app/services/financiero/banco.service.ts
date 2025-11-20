import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { environment } from '../../../environments/environment';
import { user } from '../../shared/data/user';

@Injectable({
  providedIn: 'root'
})
export class BancoService extends BaseApiService {

  private readonly endpoint = environment.apiUrl + '/financiero/bancos/obligacionesbancarias/';

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

  BuscarProveedor(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "buscar_proveedor", data, { headers: this.headers });
  }
  CargarTiposObligaciones(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "Cargar_Tipos_Obligaciones", data, { headers: this.headers });
  }
  CalcularAmortizacion(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "Calcular_Amortizacion", data, { headers: this.headers });
  }

  GuardarAmortizacion(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "guardar_modelo_amortizacion", data, { headers: this.headers });
  }
  CargarAmortizacion(): Observable<any> {
    return this.http.post<any>(this.endpoint + "cargar_amortizaciones", { headers: this.headers });
  }
  GuardarReajuste(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "guardar_reajuste", data, { headers: this.headers });
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { environment } from '../../../environments/environment';
import { user } from '../../shared/data/user';

@Injectable({
  providedIn: 'root'
})
export class OpObligacionesService extends BaseApiService {

  private readonly endpoint = environment.apiUrl + '/financiero/opciones/obligaciones/';

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

  CargarTiposObligaciones(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "Cargar_Tipos_Obligaciones", data, { headers: this.headers });
  }
  CargarACCuentasGastos(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "Cargar_ACC_CuentasGastos", data, { headers: this.headers });
  }
  Cargar_ACC_CuentasPasivos_Provision(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "Cargar_ACC_CuentasPasivos_Provision", data, { headers: this.headers });
  }
  ActualizarCuentasObligaciones(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "Actualizar_cuentas_obligaciones", data, { headers: this.headers });
  }
  BorrarTipoObligacion(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "Borrar_Tipo_Obligacion", data, { headers: this.headers });
  }
}

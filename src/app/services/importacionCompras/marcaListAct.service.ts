import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { environment } from '../../../environments/environment';
import { user } from '../../shared/data/user';

@Injectable({
  providedIn: 'root'
})
export class MarcaListActService extends BaseApiService {

  private readonly endpoint = environment.apiUrl + '/ImportCompras/proteccionMarcas/listact/';

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

  // Consolidados
  marca_creada(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "marca_creada", data, { headers: this.headers });
  }
  Cargar_Actividades_por_Consolidado(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Cargar_Actividades_por_Consolidado", data, { headers: this.headers });
  }
  Cargar_Gastos_Por_Consolidado(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Cargar_Gastos_Por_Consolidado", data, { headers: this.headers });
  }

  // Actividades Individuales
  Actividades_Individuales(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Actividades_Individuales", data, { headers: this.headers });
  }
  marca_creada2(): Observable<any> {
    return this.http.post<any>(this.endpoint + "marca_creada2", { headers: this.headers });
  }
  Facturas_marcas(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Facturas_marcas", data, { headers: this.headers });
  }
  Actualizar_actividad(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Actualizar_actividad", data, { headers: this.headers });
  }
  Cargar_Tipos_Marcas(): Observable<any> {
    return this.http.post<any>(this.endpoint + "Cargar_Tipos_Marcas", { headers: this.headers });
  }
  Cargar_Marcas_Editar(): Observable<any> {
    return this.http.post<any>(this.endpoint + "Cargar_Marcas_Editar", { headers: this.headers });
  }
  Buscar_Proteccion(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Buscar_Proteccion", data, { headers: this.headers });
  }
  Consolidar_Actividades(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Consolidar_Actividades", data, { headers: this.headers });
  }
  GUARDAR_DATOS(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "GUARDAR_DATOS", data, { headers: this.headers });
  }
  GUARDAR_NOTA_CREDITO(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "GUARDAR_NOTA_CREDITO", data, { headers: this.headers });
  }
  Eliminar_Actividad(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Eliminar_Actividad", data, { headers: this.headers });
  }
  Eliminar_actividad_creada(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Eliminar_actividad_creada", data, { headers: this.headers });
  }

  // Asignar Pagos
  Buscar_Documentos(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Buscar_Documentos", data, { headers: this.headers });
  }
  Validar_Pagos(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Validar_Pagos", data, { headers: this.headers });
  }
  Agregar_Pago(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "Agregar_Pago", data, { headers: this.headers });
  }

}

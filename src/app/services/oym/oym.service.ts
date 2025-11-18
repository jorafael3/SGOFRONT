import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { environment } from '../../../environments/environment';
import { user } from '../../shared/data/user';

@Injectable({
  providedIn: 'root'
})
export class OymService extends BaseApiService {

  private readonly endpoint = environment.apiUrl + '/oym/mpps/';

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

  CrearCarpetaMPPs( data: any ): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "CrearCarpetaMPPs", data, { headers: this.headers });
  }

  CargarCarpetaMPPs(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "CargarCarpetaMPPs", data, { headers: this.headers });
  }

  EliminarCarpetaMPPs(data: any): Observable<any> {
    data.userdata = this.getUserSessionData();
    return this.http.post<any>(this.endpoint + "EliminarCarpetaMPPs", data, { headers: this.headers });
  }

  GuardarArchivoMPPs(file: File, subpath: string, metadata?: any): Observable<any> {
    const formData = new FormData();
    const userdata = this.getUserSessionData();
    formData.append('userdata', JSON.stringify(userdata));
    formData.append('file', file);
    formData.append('subpath', subpath);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    return this.http.post(this.endpoint + "GuardarArchivoMPPs", formData, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.getUserSessionToken()}` })
    });
  }

  EditarArchivoMPPs(path: string, newPath: string, metadata?: any): Observable<any> {
    const userdata = this.getUserSessionData();
    return this.http.post(this.endpoint + "EditarArchivoMPPs",
      { path, newPath, metadata, userdata },
      { headers: this.headers }
    );
  }

  EliminarArchivoMPPs(path: string): Observable<any> {
    const userdata = this.getUserSessionData();
    return this.http.post(this.endpoint + "EliminarArchivoMPPs", { path, userdata }, { headers: this.headers });
  }

  getDepartamentos(): Observable<any> {
    return this.http.post<any>(this.endpoint + "getDepartamentos", {}, { headers: this.headers });
  }
}

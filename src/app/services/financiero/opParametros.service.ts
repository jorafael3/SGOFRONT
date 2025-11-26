import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { environment } from '../../../environments/environment';
import { user } from '../../shared/data/user';

@Injectable({
  providedIn: 'root'
})
export class OpParametrosService extends BaseApiService {

  private readonly endpoint = environment.apiUrl + '/financiero/opciones/parametros/';

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

  
}

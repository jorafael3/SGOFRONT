import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest, UsuarioListResponse, UsuarioResponse } from '../../models/usuario.model';
import { ApiResponse } from '../../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsuariosService extends BaseApiService {

    private readonly endpoint = environment.apiUrl + '/planes/planes/';

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
            console.warn('Error parsing user data from localStorage:', error);
            userData = user; // Si no es JSON, usar como string
        }
        return userData;
    }

    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getUserSessionToken()}`
    });

    getPlanes(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "getPlanes", data, { headers: this.headers });
    }

    createPlan(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "createPlan", data, { headers: this.headers });
    }
}
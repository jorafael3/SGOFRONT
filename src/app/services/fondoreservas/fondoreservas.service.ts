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

export class FondoreservasService extends BaseApiService {

    private readonly endpoint = environment.apiUrl + '/recursoshumanos/fondoreservas/';

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
    /**
     * Enviar petición libre a cualquier endpoint
     */
    getUserList(data: any): Observable<any> {
        return this.http.post<any>(this.endpoint + "GetUsuarios", data, { headers: this.headers });
    }

    getDepartamentosLogistica(data: any): Observable<any> {
        return this.http.post<any>(this.endpoint + "GetDepartamentosLogistica", data, { headers: this.headers });
    }

    createUser(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "CrearUsuario", data, { headers: this.headers });
    }
    updateUser(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "ActualizarUsuario", data, { headers: this.headers });
    }

    GetUserMenu(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "GetMenuUsuario", data, { headers: this.headers });
    }

    GetUserMenuAsignacion(data: any): Observable<any> {
        // data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "GetMenuUsuarioAsignacion", data, { headers: this.headers });
    }

    /**
     * Guardar datos del Fondo de Reservas
     * @param data - Objeto con empresa y datos de empleados procesados del Excel
     */
    guardarDatos(data: any): Observable<any> {
        return this.http.post<any>(this.endpoint + "GuardarDatosFondoReservas", data, { headers: this.headers });
    }
}
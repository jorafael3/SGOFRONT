/**
 * Obtener historial de pagos/suscripción de la empresa
 */

// ...existing imports...
// ...mantener solo UNA clase UsuariosService...
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

    private readonly endpoint = environment.apiUrl + '/empresas/empresa/';

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
    getEmpresaList(data: any): Observable<any> {
        return this.http.post<any>(this.endpoint + "getAllEmpresas", data, { headers: this.headers });
    }

    getUserDetails(data: any): Observable<any> {
        return this.http.post<any>(this.endpoint + "getUserDetails", data, { headers: this.headers });
    }

    updateUserData(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "updateUserData", data, { headers: this.headers });
    }

    deleteUser(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "deleteUser", data, { headers: this.headers });
    }

    createEmpresa(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "create", data, { headers: this.headers });
    }

    getEmpresaDataByUid(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "getEmpresaDataByUid", data, { headers: this.headers });
    }

    getContactosEmpresa(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "getContactosEmpresa", data, { headers: this.headers });
    }
    /**
     * Obtener historial de pagos/suscripción de la empresa
     */
    getHistorialPagosEmpresa(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "getHistorialPagosEmpresa", data, { headers: this.headers });
    }

    createContactoEmpresa(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "createContacto", data, { headers: this.headers });
    }

    agregarPlanEmpresa(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "agregarPlanEmpresa", data, { headers: this.headers });
    }

    getPlanesEmpresa(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "getPlanesEmpresa", data, { headers: this.headers });
    }


    // /**
    //  * Obtener usuario por ID
    //  */
    // getUserById(id: number): Observable<ApiResponse<UsuarioResponse>> {
    //     return this.get<ApiResponse<UsuarioResponse>>(`${this.endpoint}/${id}`);
    // }

    // /**
    //  * Crear nuevo usuario
    //  */
    // createUser(userData: CreateUsuarioRequest): Observable<ApiResponse<UsuarioResponse>> {
    //     return this.post<ApiResponse<UsuarioResponse>>(this.endpoint, userData);
    // }

    // /**
    //  * Actualizar usuario
    //  */
    // updateUser(id: number, userData: UpdateUsuarioRequest): Observable<ApiResponse<UsuarioResponse>> {
    //     return this.put<ApiResponse<UsuarioResponse>>(`${this.endpoint}/${id}`, userData);
    // }

    // /**
    //  * Eliminar usuario
    //  */
    // deleteUser(id: number): Observable<ApiResponse<any>> {
    //     return this.delete<ApiResponse<any>>(`${this.endpoint}/${id}`);
    // }

    // /**
    //  * Obtener perfil del usuario actual
    //  */
    // getCurrentUserProfile(): Observable<ApiResponse<UsuarioResponse>> {
    //     return this.get<ApiResponse<UsuarioResponse>>(`${this.endpoint}/profile`);
    // }

    // /**
    //  * Cambiar estado de usuario (activar/desactivar)
    //  */
    // changeUserStatus(id: number, estado: string): Observable<ApiResponse<UsuarioResponse>> {
    //     return this.put<ApiResponse<UsuarioResponse>>(`${this.endpoint}/${id}/status`, { estado });
    // }
}
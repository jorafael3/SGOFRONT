import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MenusService extends BaseApiService {

    private readonly endpoint = environment.apiUrl + '/mantenimiento/menus/';

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
            userData = user;
        }
        return userData;
    }

    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getUserSessionToken()}`
    });

    /**
     * Obtener lista de menús
     */
    getMenuList(data: any): Observable<any> {
        return this.http.post<any>(this.endpoint + "GetMenus", data, { headers: this.headers });
    }

    /**
     * Crear nuevo menú
     */
    createMenu(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "CrearMenu", data, { headers: this.headers });
    }

    /**
     * Actualizar menú
     */
    updateMenu(data: any): Observable<any> {
        data.sessionData = this.getUserSessionData();
        return this.http.post<any>(this.endpoint + "ActualizarMenu", data, { headers: this.headers });
    }

    /**
     * Obtener menú por ID
     */
    getMenuById(menuId: number): Observable<any> {
        return this.http.get<any>(this.endpoint + `GetMenuById/${menuId}`, { headers: this.headers });
    }

    /**
     * Eliminar menú
     */
    deleteMenu(menuId: number): Observable<any> {
        return this.http.delete<any>(this.endpoint + `DeleteMenu/${menuId}`, { headers: this.headers });
    }

    /**
     * Obtener menús disponibles para seleccionar como padre
     */
    getAvailableParentMenus(empresa: string, excludeMenuId?: number): Observable<any> {
        const params = new URLSearchParams();
        params.append('empresa', empresa);
        if (excludeMenuId) {
            params.append('excludeMenuId', excludeMenuId.toString());
        }
        return this.http.get<any>(this.endpoint + `GetAvailableParentMenus?${params.toString()}`, { headers: this.headers });
    }
}

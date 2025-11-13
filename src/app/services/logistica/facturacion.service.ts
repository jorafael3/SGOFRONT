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
export class FacturacionService extends BaseApiService {

    private readonly endpoint = environment.apiUrl + '/logistica/facturacion/prepararfacturas/';
    private readonly endpointverificar = environment.apiUrl + '/logistica/facturacion/verificarfacturas/';
    private readonly endpointguiaspickup = environment.apiUrl + '/logistica/facturacion/guiaspickup/';
    private readonly endpointtracking = environment.apiUrl + '/logistica/facturacion/tracking/';

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

    //*** PREPARAR FACTURAS */

    GetFacturasPorPreparar(data: any): Observable<any> {
        return this.http.post<any>(this.endpoint + "GetFacturasPorPreparar", data, { headers: this.headers });
    }

    GetFacturasDatos(data: any): Observable<any> {
        return this.http.post<any>(this.endpoint + "GetFacturasDatos", data, { headers: this.headers });
    }

    FinalizarPreparacion(data: any): Observable<any> {
        return this.http.post<any>(this.endpoint + "FinalizarPreparacion", data, { headers: this.headers });
    }

    //*** VERIFICAR FACTURAS    */

    GetFacturasPorVerificar(data: any): Observable<any> {
        return this.http.post<any>(this.endpointverificar + "GetFacturasPorVerificar", data, { headers: this.headers });
    }

    GetFacturasDatosVerificar(data: any): Observable<any> {
        return this.http.post<any>(this.endpointverificar + "GetFacturasDatos", data, { headers: this.headers });
    }

    ValidarSerie(data: any): Observable<any> {
        return this.http.post<any>(this.endpointverificar + "ValidarSerie", data, { headers: this.headers });
    }

    FinalizarVerificacion(data: any): Observable<any> {
        data.userdata = this.getUserSessionData();
        return this.http.post<any>(this.endpointverificar + "FinalizarVerificacion", data, { headers: this.headers });
    }

    //** GUIAS PICKUP */

    GetFacturasPorGuiasPickup(data: any): Observable<any> {
        return this.http.post<any>(this.endpointguiaspickup + "GetFacturasGuiasPickup", data, { headers: this.headers });
    }

    GetTransporteGuiasPickup(data: any): Observable<any> {
        return this.http.post<any>(this.endpointguiaspickup + "GetTransporteGuiasPickup", data, { headers: this.headers });
    }

    FinalizarGuiasPickup(data: any): Observable<any> {
        data.userdata = this.getUserSessionData();
        return this.http.post<any>(this.endpointguiaspickup + "GuardarGuiasPickup", data, { headers: this.headers });
    }

    GuardarCambioTipoPedido(data: any): Observable<any> {
        // Implementar la lógica para guardar el cambio de tipo de pedido
        data.userdata = this.getUserSessionData();
        return this.http.post<any>(this.endpointguiaspickup + "GuardarCambioTipoPedido", data, { headers: this.headers });
    }

    //** TRACKING  */

    GetFacturasTracking(data: any): Observable<any> {
        return this.http.post<any>(this.endpointtracking + "GetFacturasTracking", data, { headers: this.headers });
    }

    GetFacturasSeries(data: any): Observable<any> {
        return this.http.post<any>(this.endpointtracking + "GetFacturasSeries", data, { headers: this.headers });
    }

}
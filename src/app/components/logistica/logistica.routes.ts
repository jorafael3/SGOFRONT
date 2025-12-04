import { Routes } from '@angular/router';

import { PrepararFacturasComponent } from "./picking/prepararfacturas/preparar-facturas.component";
import { DropshippingFacturasComponent } from "./picking/dropshipping/dropshipping-facturas.component";
import { VerificarFacturasComponent } from "./picking/verificarfacturas/verificar-facturas.component";
import { GuiasPickupComponent } from "./picking/guiaspickup/guias-pickup.component";
import { OpcionesComponent } from "./opciones/opciones.component";
import { DespacharFacturasComponent } from "./picking/despachar/despachar-facturas.component";
import { TrackingFacturasComponent } from "./tracking/tracking-facturas.component";
import { ModificarSeriesComponent } from "./modificarseries/modificarseries.component";

export const LogisticaRoutes: Routes = [
    {
        path: 'picking/prepararfacturas',
        component: PrepararFacturasComponent,
        data: {
            title: 'Preparar Facturas',
            breadcrumb: 'Preparar Facturas'
        }
    },
    {
        path: 'picking/dropshipping',
        component: DropshippingFacturasComponent,
        data: {
            title: 'Dropshipping Facturas',
            breadcrumb: 'Dropshipping Facturas'
        }
    },
    {
        path: 'picking/verificarfacturas',
        component: VerificarFacturasComponent,
        data: {
            title: 'Verificar Facturas',
            breadcrumb: 'Verificar Facturas'
        }
    },
    {
        path: 'picking/guiaspickup',
        component: GuiasPickupComponent,
        data: {
            title: 'Guias Pickup',
            breadcrumb: 'Guias Pickup'
        }
    },
    {
        path: 'opciones',
        component: OpcionesComponent,
        data: {
            title: 'Opciones',
            breadcrumb: 'Opciones'
        }
    },
    {
        path: 'picking/despachar',
        component: DespacharFacturasComponent,
        data: {
            title: 'Facturas por despachar',
            breadcrumb: 'Facturas por despachar'
        }
    },
    {
        path: 'tracking',
        component: TrackingFacturasComponent,
        data: {
            title: 'Tracking Facturas',
            breadcrumb: 'Facturas por rastrear'
        }
    },
    {
        path: 'modificarseries',
        component: ModificarSeriesComponent,
        data: {
            title: 'Modificar Series',
            breadcrumb: 'Modificar Series'
        }
    },
    // {
    //     path: 'planes',
    //     component: PlanesComponent,
    //     data: {
    //         title: 'Planes',
    //         breadcrumb: 'Planes'
    //     }
    // },
    // {
    //     path: 'panel_empresa/:uid',
    //     component: PanelEmpresaComponent,
    //     data: {
    //         title: 'Datos de la Empresa',
    //         breadcrumb: 'Datos de la Empresa'
    //     }
    // }
];

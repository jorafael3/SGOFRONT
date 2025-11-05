import { Routes } from '@angular/router';

import { PrepararFacturasComponent } from "./picking/prepararfacturas/preparar-facturas.component";
import { VerificarFacturasComponent } from "./picking/verificarfacturas/verificar-facturas.component";
import { GuiasPickupComponent } from "./picking/guiaspickup/guias-pickup.component";
import { OpcionesComponent } from "./opciones/opciones.component";
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

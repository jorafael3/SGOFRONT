import { Routes } from '@angular/router';
import { CustomerOrderReportComponent } from "./empresas/customer-order-report.component";
import { PlanesComponent } from "./planes/customer-order-report.component";
import { PanelEmpresaComponent } from "./panel_empresa/PanelEmpresa.component";

export const empresasRoutes: Routes = [
    {
        path: 'empresas',
        component: CustomerOrderReportComponent,
        data: {
            title: 'Empresas',
            breadcrumb: 'Empresas'
        }
    },
    {
        path: 'planes',
        component: PlanesComponent,
        data: {
            title: 'Planes',
            breadcrumb: 'Planes'
        }
    },
    {
        path: 'panel_empresa/:uid',
        component: PanelEmpresaComponent,
        data: {
            title: 'Datos de la Empresa',
            breadcrumb: 'Datos de la Empresa'
        }
    }
];

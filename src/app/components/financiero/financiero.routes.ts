import { Routes } from '@angular/router';

import { ObligacionesBancariasComponent } from "../financiero/obligacionesbancarias/obligaciones.component";
import { OpcionesBancariasComponent } from "../financiero/opciones/opciones.component";


export const FinancieroRoutes: Routes = [
    {
        path: 'obligacionesbancarias',
        component: ObligacionesBancariasComponent,
        data: {
            title: 'Obligaciones Bancarias',
            breadcrumb: 'Obligaciones Bancarias'
        }
    },
    {
        path: 'opciones',
        component: OpcionesBancariasComponent,
        data: {
            title: 'Opciones',
            breadcrumb: 'Opciones'
        }
    },
];

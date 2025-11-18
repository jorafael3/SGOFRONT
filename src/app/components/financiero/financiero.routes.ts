import { Routes } from '@angular/router';

import { ObligacionesBancariasComponent } from "../financiero/obligacionesbancarias/obligaciones.component";

export const FinancieroRoutes: Routes = [
    {
        path: 'obligacionesbancarias',
        component: ObligacionesBancariasComponent,
        data: {
            title: 'Obligaciones Bancarias',
            breadcrumb: 'Obligaciones Bancarias'
        }
    }
];

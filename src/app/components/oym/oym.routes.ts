import { Routes } from '@angular/router';

import { ManualesFuncionesComponent } from './mpps/manuales_de_funciones/manuales_de_funciones.component';
import { ProcedimientosComponent } from './mpps/procedimientos/procedimientos.component';
import { PoliticasComponent } from './mpps/politicas/politicas.component';

export const oymRoutes: Routes = [
    {
        path: 'mpps/manuales_de_funciones',
        component: ManualesFuncionesComponent,
        data: {
            title: 'Manual de Funciones',
            breadcrumb: 'Manual de Funciones'
        }
    },
    {
        path: 'mpps/procedimientos',
        component: ProcedimientosComponent,
        data: {
            title: 'Procedimientos',
            breadcrumb: 'Procedimientos'
        }
    },
    {
        path: 'mpps/politicas',
        component: PoliticasComponent,
        data: {
            title: 'Políticas',
            breadcrumb: 'Políticas'
        }
    },
];

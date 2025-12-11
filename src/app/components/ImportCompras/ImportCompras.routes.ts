import { Routes } from '@angular/router';

import { ProteccionMarcasComponent } from "./proteccionMarcas/proteccionMarcas.component";

export const ImportComprasRoutes: Routes = [
    {
        path: 'proteccionMarcas',
        component: ProteccionMarcasComponent,
        data: {
            title: 'Protección de Marcas',
            breadcrumb: 'Protección de Marcas'
        }
    }
];

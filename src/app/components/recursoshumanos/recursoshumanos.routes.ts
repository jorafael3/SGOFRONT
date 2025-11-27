import { Routes } from '@angular/router';
import { FondoreservasComponent } from "./fondoreservas/fondoreservas.component";

export const recursoshumanosRoutes: Routes = [
    {
        path: 'fondoreservas',
        component: FondoreservasComponent,
        data: {
            title: 'Fondo de Reservas',
            breadcrumb: 'Fondo de Reservas'
        }
    }
];

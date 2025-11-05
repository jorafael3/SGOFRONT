import { Routes } from '@angular/router';
import { UsuariosComponent } from "./usuarios/usuarios.component";

export const mantenimientoRoutes: Routes = [
    {
        path: 'usuarios',
        component: UsuariosComponent,
        data: {
            title: 'Usuarios',
            breadcrumb: 'Usuarios'
        }
    },
];

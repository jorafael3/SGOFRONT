import { Routes } from '@angular/router';
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { MenusComponent } from "./menus/menus.component";

export const mantenimientoRoutes: Routes = [
    {
        path: 'usuarios',
        component: UsuariosComponent,
        data: {
            title: 'Usuarios',
            breadcrumb: 'Usuarios'
        }
    }, {
        path: 'menus',
        component: MenusComponent,
        data: {
            title: 'Menús',
            breadcrumb: 'Menús'
        }
    }
];

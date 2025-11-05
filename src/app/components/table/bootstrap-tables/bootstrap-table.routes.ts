import { Routes } from '@angular/router';

import { BasicTableComponent } from './basic-table/basic-table.component';
import { TableComponentsComponent } from './table-components/table-components.component';

export const bootstrapTables: Routes = [
    {
        path: 'basic-tables',
        component: BasicTableComponent,
        data: {
            title: "Bootstrap Basic Tables",
            breadcrumb: "Bootstrap Basic Tables",
        }
    },
    {
        path: 'table-components',
        component: TableComponentsComponent,
        data: {
            title: "Table Components",
            breadcrumb: "Table Components",
        }
    },
];
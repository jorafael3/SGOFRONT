import { Routes } from '@angular/router';

import { FaqComponent } from './faq.component';

export const faq: Routes = [
    {
        path: '',
        component: FaqComponent,
        data: {
            breadcrumb: 'FAQ'
        },
    }
];
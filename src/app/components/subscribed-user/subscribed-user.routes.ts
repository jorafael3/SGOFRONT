import { Routes } from '@angular/router';

import { SubscribedUserComponent } from './subscribed-user.component';

export const subscribedUser: Routes = [
    {
        path: '',
        component: SubscribedUserComponent,
        data: {
            breadcrumb: 'Subscribed User'
        },
    }
];
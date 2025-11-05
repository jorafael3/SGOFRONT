import { Routes } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { OnlineCourseComponent } from './online-course/online-course.component';
import { CryptoComponent } from './crypto/crypto.component';
import { SocialComponent } from './social/social.component';
import { NftComponent } from './nft/nft.component';
import { SchoolManagementComponent } from './school-management/school-management.component';
import { PosComponent } from './pos/pos.component';
import { CrmComponent } from './crm/crm.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HrComponent } from './hr/hr.component';
import { ProjectsComponent } from './projects/projects.component';
import { LogisticsComponent } from './logistics/logistics.component';

export const dashboard: Routes = [
    {
        path: 'default',
        component: DefaultComponent,
        data : {
            pageTitle: "Default Dashboard",
            title : "Default",
            breadcrumb: "Default"
        },
    },
    // {
    //     path: 'e-commerce',
    //     component: EcommerceComponent,
    //     data : {
    //         pageTitle: "E-Commerce Dashboard",
    //         title : "E-Commerce",
    //         breadcrumb: "E-Commerce"
    //     },
    // },
    // {
    //     path: 'online-course',
    //     component: OnlineCourseComponent,
    //     data : {
    //         pageTitle: "Online course Dashboard",
    //         title : "Online course",
    //         breadcrumb: "Online course"
    //     },
    // },
    // {
    //     path: 'crypto',
    //     component: CryptoComponent,
    //     data : {
    //         pageTitle: "Crypto Dashboard",
    //         title : "Crypto",
    //         breadcrumb: "Crypto"
    //     },
    // },
    // {
    //     path: 'social',
    //     component: SocialComponent,
    //     data : {
    //         pageTitle: "Social Dashboard",
    //         title : "Social",
    //         breadcrumb: "Social"
    //     },
    // },
    // {
    //     path: 'nft',
    //     component: NftComponent,
    //     data : {
    //         pageTitle: "NFT Dashboard",
    //         title : "NFT",
    //         breadcrumb: "NFT"
    //     },
    // },
    // {
    //     path: 'school-management',
    //     component: SchoolManagementComponent,
    //     data : {
    //         pageTitle: "School management Dashboard",
    //         title : "School management",
    //         breadcrumb: "School manage"
    //     }
    // },
    // {
    //     path: 'pos',
    //     component: PosComponent,
    //     data : {
    //         pageTitle: "POS Dashboard",
    //         title : "POS",
    //         breadcrumb: "POS"
    //     },
    // },
    // {
    //     path: 'crm',
    //     component: CrmComponent,
    //     data : {
    //         pageTitle: "CRM Dashboard",
    //         title : "CRM",
    //         breadcrumb: "CRM"
    //     },
    // },
    // {
    //     path: 'analytics',
    //     component: AnalyticsComponent,
    //     data : {
    //         pageTitle: "Analytics Dashboard",
    //         title : "Analytics",
    //         breadcrumb: "Analytics"
    //     }
    // },
    // {
    //     path: 'hr',
    //     component: HrComponent,
    //     data : {
    //         pageTitle: "HR Dashboard",
    //         title : "HR Dashboard",
    //         breadcrumb: "HR Dashboard"
    //     },
    // },
    // {
    //     path: 'projects',
    //     component: ProjectsComponent,
    //     data : {
    //         pageTitle: "Projects Dashboard",
    //         title : "Projects Dashboard",
    //         breadcrumb: "Projects Dashboard"
    //     }
    // },
    // {
    //     path: 'logistics',
    //     component: LogisticsComponent,
    //     data : {
    //         pageTitle: "Logistics Dashboard",
    //         title : "Logistics Dashboard",
    //         breadcrumb: "Logistics Dashboard"
    //     },
    // },
];

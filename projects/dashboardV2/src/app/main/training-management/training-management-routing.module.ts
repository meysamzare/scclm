import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingManagementComponent } from './training-management.component';

const routes: Routes = [
    {
        path: '',
        component: TrainingManagementComponent
    },
    { path: 'titute', loadChildren: () => import('./titute/titute.module').then(m => m.TituteModule) },
    { path: 'yeareducation', loadChildren: () => import('./yeareducation/yeareducation.module').then(m => m.YeareducationModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainingManagementRoutingModule { }

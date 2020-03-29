import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingManagementComponent } from './training-management.component';

const routes: Routes = [
    {
        path: '',
        component: TrainingManagementComponent
    },
    { path: 'titute', loadChildren: () => import('./titute/titute.module').then(m => m.TituteModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainingManagementRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingManagementComponent } from './training-management.component';

const routes: Routes = [
    {
        path: '',
        component: TrainingManagementComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainingManagementRoutingModule { }

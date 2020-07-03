import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { IndexComponent } from './index/index.component';
import { MainCanActiveGuard } from './main-can-active.guard';


const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        canActivate: [MainCanActiveGuard],
        canActivateChild: [MainCanActiveGuard],
        children: [
            {
                path: "",
                pathMatch: "full",
                component: IndexComponent
            },
            { path: 'training-management', loadChildren: () => import('./training-management/training-management.module').then(m => m.TrainingManagementModule) },
            { path: 'student-management', loadChildren: () => import('./student-management/student-management.module').then(m => m.StudentManagementModule) }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }

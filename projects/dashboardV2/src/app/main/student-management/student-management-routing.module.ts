import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentManagementComponent } from './student-management.component';

const routes: Routes = [
    { path: '', component: StudentManagementComponent },
    { path: 'student', loadChildren: () => import('./student/student.module').then(m => m.StudentModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentManagementRoutingModule { }

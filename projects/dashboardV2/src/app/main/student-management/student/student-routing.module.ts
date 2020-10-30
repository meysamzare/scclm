import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IStudent } from 'src/app/Dashboard/student/student';
import { DataEditResolverService } from '../../../shared/reusable-component/data/data-edit/data-edit-resolver.service';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentListComponent } from './student-list/student-list.component';

import { StudentComponent } from './student.component';

const routes: Routes = [
    { path: '', component: StudentComponent },
    {
        path: "list",
        component: StudentListComponent
    },
    {
        path: "edit/:id",
        component: StudentEditComponent,
        data: {
            newData: new IStudent,
            apiUrl: "Student"
        },
        resolve: {
            data: DataEditResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherComponent } from './teacher.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { TeacherEditComponent } from './teacher-edit/teacher-edit.component';
import { ITeacher } from 'src/app/Dashboard/teacher/teacher';
import { DataEditResolverService } from '../../../shared/reusable-component/data/data-edit/data-edit-resolver.service';

const routes: Routes = [
    { path: '', component: TeacherComponent },
    {
        path: "list",
        component: TeacherListComponent
    },
    {
        path: "edit/:id",
        component: TeacherEditComponent,
        data: {
            newData: new ITeacher,
            apiUrl: "Teacher"
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
export class TeacherRoutingModule { }

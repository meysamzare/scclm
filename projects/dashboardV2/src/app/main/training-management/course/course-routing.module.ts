import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseComponent } from './course.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { ICourse } from 'src/app/Dashboard/course/course';
import { DataEditResolverService } from '../../../shared/reusable-component/data/data-edit/data-edit-resolver.service';

const routes: Routes = [
    { path: '', component: CourseComponent },
    {
        path: "list",
        component: CourseListComponent
    },
    {
        path: "edit/:id",
        component: CourseEditComponent,
        data: {
            newData: new ICourse,
            apiUrl: "Course"
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
export class CourseRoutingModule { }

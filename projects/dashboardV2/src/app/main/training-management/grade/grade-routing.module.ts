import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GradeComponent } from './grade.component';
import { GradeListComponent } from './grade-list/grade-list.component';
import { GradeEditComponent } from './grade-edit/grade-edit.component';
import { IGrade } from 'src/app/Dashboard/grade/grade';
import { DataEditResolverService } from '../../../shared/reusable-component/data/data-edit/data-edit-resolver.service';

const routes: Routes = [
    { path: '', component: GradeComponent },
    {
        path: "list",
        component: GradeListComponent
    },
    {
        path: "edit/:id",
        component: GradeEditComponent,
        data: {
            newData: new IGrade,
            apiUrl: "Grade"
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
export class GradeRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassComponent } from './class.component';
import { ClassListComponent } from './class-list/class-list.component';
import { ClassEditComponent } from './class-edit/class-edit.component';
import { IClass } from 'src/app/Dashboard/class/class';
import { DataEditResolverService } from '../../../shared/reusable-component/data/data-edit/data-edit-resolver.service';

const routes: Routes = [
    { path: '', component: ClassComponent },
    {
        path: "list",
        component: ClassListComponent
    },
    {
        path: "edit/:id",
        component: ClassEditComponent,
        data: {
            newData: new IClass,
            apiUrl: "Class"
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
export class ClassRoutingModule { }

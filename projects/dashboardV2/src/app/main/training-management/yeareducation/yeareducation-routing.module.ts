import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YeareducationComponent } from './yeareducation.component';
import { YeareducationListComponent } from './yeareducation-list/yeareducation-list.component';
import { YeareducationEditComponent } from './yeareducation-edit/yeareducation-edit.component';
import { IYeareducation } from 'src/app/Dashboard/yeareducation/yeareducation';
import { DataEditResolverService } from '../../../shared/reusable-component/data/data-edit/data-edit-resolver.service';

const routes: Routes = [
    {
        path: "",
        component: YeareducationComponent
    },
    {
        path: "list",
        component: YeareducationListComponent
    },
    {
        path: "edit/:id",
        component: YeareducationEditComponent,
        data: {
            newData: new IYeareducation,
            apiUrl: "Yeareducation"
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
export class YeareducationRoutingModule { }

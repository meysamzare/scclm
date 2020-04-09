import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TituteComponent } from './titute.component';
import { TituteListComponent } from './titute-list/titute-list.component';
import { TituteEditComponent } from './titute-edit/titute-edit.component';
import { DataEditResolverService } from '../../../shared/reusable-component/data/data-edit/data-edit-resolver.service';
import { ITitute } from 'src/app/Dashboard/titute/titute';

const routes: Routes = [
    {
        path: '',
        component: TituteComponent
    },
    {
        path: "list",
        component: TituteListComponent
    },
    {
        path: "edit/:id",
        component: TituteEditComponent,
        data: {
            newData: new ITitute,
            apiUrl: "Titute"
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
export class TituteRoutingModule { }

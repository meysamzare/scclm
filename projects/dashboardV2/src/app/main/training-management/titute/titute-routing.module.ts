import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TituteComponent } from './titute.component';
import { TituteListComponent } from './titute-list/titute-list.component';

const routes: Routes = [
    {
        path: '',
        component: TituteComponent
    },
    {
        path: "list",
        component: TituteListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TituteRoutingModule { }

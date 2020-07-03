import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DaysOfWeekComponent } from './days-of-week.component';
import { DaysOfWeekListComponent } from './days-of-week-list/days-of-week-list.component';
import { DaysOfWeekEditComponent } from './days-of-week-edit/days-of-week-edit.component';
import { ITimeAndDays } from 'src/app/Dashboard/timeanddays/timeanddays';
import { DataEditResolverService } from '../../../shared/reusable-component/data/data-edit/data-edit-resolver.service';

const routes: Routes = [
    { path: '', component: DaysOfWeekComponent },
    {
        path: "list",
        component: DaysOfWeekListComponent
    },
    {
        path: "edit/:id",
        component: DaysOfWeekEditComponent,
        data: {
            newData: new ITimeAndDays,
            apiUrl: "TimeAndDays"
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
export class DaysOfWeekRoutingModule { }

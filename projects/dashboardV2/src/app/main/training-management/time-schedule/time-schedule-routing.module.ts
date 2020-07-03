import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeScheduleComponent } from './time-schedule.component';
import { TimeScheduleListComponent } from './time-schedule-list/time-schedule-list.component';
import { TimeScheduleEditComponent } from './time-schedule-edit/time-schedule-edit.component';
import { ITimeSchedule } from 'src/app/Dashboard/timeschedule/timeschedule';
import { DataEditResolverService } from '../../../shared/reusable-component/data/data-edit/data-edit-resolver.service';

const routes: Routes = [
    { path: '', component: TimeScheduleComponent },
    {
        path: "list",
        component: TimeScheduleListComponent
    },
    {
        path: "edit/:id",
        component: TimeScheduleEditComponent,
        data: {
            newData: new ITimeSchedule,
            apiUrl: "TimeSchedule"
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
export class TimeScheduleRoutingModule { }

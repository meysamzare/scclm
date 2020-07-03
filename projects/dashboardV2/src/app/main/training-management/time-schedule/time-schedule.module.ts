import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeScheduleRoutingModule } from './time-schedule-routing.module';
import { TimeScheduleComponent } from './time-schedule.component';
import { TimeScheduleEditComponent } from './time-schedule-edit/time-schedule-edit.component';
import { ReusableComponentModule } from '../../../shared/reusable-component/reusable-component.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { TimeScheduleListComponent } from './time-schedule-list/time-schedule-list.component';


@NgModule({
    declarations: [TimeScheduleComponent, TimeScheduleEditComponent, TimeScheduleListComponent],
    imports: [
        CommonModule,
        TimeScheduleRoutingModule,
        ReusableComponentModule,
        MaterialModule,
        FormsModule
    ]
})
export class TimeScheduleModule { }

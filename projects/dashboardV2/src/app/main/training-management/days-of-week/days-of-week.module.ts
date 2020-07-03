import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DaysOfWeekRoutingModule } from './days-of-week-routing.module';
import { DaysOfWeekComponent } from './days-of-week.component';
import { DaysOfWeekEditComponent } from './days-of-week-edit/days-of-week-edit.component';
import { ReusableComponentModule } from '../../../shared/reusable-component/reusable-component.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { DaysOfWeekListComponent } from './days-of-week-list/days-of-week-list.component';


@NgModule({
    declarations: [DaysOfWeekComponent, DaysOfWeekEditComponent, DaysOfWeekListComponent],
    imports: [
        CommonModule,
        DaysOfWeekRoutingModule,
        ReusableComponentModule,
        MaterialModule,
        FormsModule
    ]
})
export class DaysOfWeekModule { }

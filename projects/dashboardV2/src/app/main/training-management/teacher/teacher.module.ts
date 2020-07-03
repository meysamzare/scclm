import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherComponent } from './teacher.component';
import { TeacherEditComponent } from './teacher-edit/teacher-edit.component';
import { ReusableComponentModule } from '../../../shared/reusable-component/reusable-component.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { TeacherListComponent } from './teacher-list/teacher-list.component';


@NgModule({
    declarations: [TeacherComponent, TeacherEditComponent, TeacherListComponent],
    imports: [
        CommonModule,
        TeacherRoutingModule,
        ReusableComponentModule,
        MaterialModule,
        FormsModule
    ]
})
export class TeacherModule { }

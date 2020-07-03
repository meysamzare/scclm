import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { ReusableComponentModule } from '../../../shared/reusable-component/reusable-component.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentFastEditModalComponent } from './student-list/student-fast-edit-modal/student-fast-edit-modal.component';


@NgModule({
    declarations: [StudentComponent, StudentEditComponent, StudentListComponent, StudentFastEditModalComponent],
    imports: [
        CommonModule,
        StudentRoutingModule,
        ReusableComponentModule,
        MaterialModule,
        FormsModule
    ]
})
export class StudentModule { }

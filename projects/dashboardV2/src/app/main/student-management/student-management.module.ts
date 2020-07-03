import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentManagementRoutingModule } from './student-management-routing.module';
import { StudentManagementComponent } from './student-management.component';
import { ReusableComponentModule } from '../../shared/reusable-component/reusable-component.module';


@NgModule({
    declarations: [StudentManagementComponent],
    imports: [
        CommonModule,
        StudentManagementRoutingModule,
        ReusableComponentModule
    ]
})
export class StudentManagementModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { ReusableComponentModule } from '../../../shared/reusable-component/reusable-component.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CourseListComponent } from './course-list/course-list.component';


@NgModule({
    declarations: [CourseComponent, CourseEditComponent, CourseListComponent],
    imports: [
        CommonModule,
        CourseRoutingModule,
        ReusableComponentModule,
        MaterialModule,
        FormsModule
    ]
})
export class CourseModule { }

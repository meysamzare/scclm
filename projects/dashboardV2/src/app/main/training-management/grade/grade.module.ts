import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GradeRoutingModule } from './grade-routing.module';
import { GradeComponent } from './grade.component';
import { ReusableComponentModule } from '../../../shared/reusable-component/reusable-component.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { GradeEditComponent } from './grade-edit/grade-edit.component';
import { GradeListComponent } from './grade-list/grade-list.component';


@NgModule({
    declarations: [GradeComponent, GradeEditComponent, GradeListComponent],
    imports: [
        CommonModule,
        GradeRoutingModule,
        ReusableComponentModule,
        MaterialModule,
        FormsModule
    ]
})
export class GradeModule { }

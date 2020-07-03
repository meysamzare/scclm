import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassRoutingModule } from './class-routing.module';
import { ClassComponent } from './class.component';
import { ReusableComponentModule } from '../../../shared/reusable-component/reusable-component.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { ClassEditComponent } from './class-edit/class-edit.component';
import { ClassListComponent } from './class-list/class-list.component';


@NgModule({
    declarations: [ClassComponent, ClassEditComponent, ClassListComponent],
    imports: [
        CommonModule,
        ClassRoutingModule,
        ReusableComponentModule,
        MaterialModule,
        FormsModule
    ]
})
export class ClassModule { }

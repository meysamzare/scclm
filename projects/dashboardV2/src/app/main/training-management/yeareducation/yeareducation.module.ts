import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YeareducationRoutingModule } from './yeareducation-routing.module';
import { YeareducationComponent } from './yeareducation.component';
import { ReusableComponentModule } from '../../../shared/reusable-component/reusable-component.module';
import { YeareducationEditComponent } from './yeareducation-edit/yeareducation-edit.component';
import { YeareducationListComponent } from './yeareducation-list/yeareducation-list.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [YeareducationComponent, YeareducationEditComponent, YeareducationListComponent],
    imports: [
        CommonModule,
        YeareducationRoutingModule,
        ReusableComponentModule,
        MaterialModule,
        FormsModule
    ]
})
export class YeareducationModule { }

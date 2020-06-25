import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TituteRoutingModule } from './titute-routing.module';
import { TituteComponent } from './titute.component';
import { ReusableComponentModule } from '../../../shared/reusable-component/reusable-component.module';
import { TituteListComponent } from './titute-list/titute-list.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { TituteEditComponent } from './titute-edit/titute-edit.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [TituteComponent, TituteListComponent, TituteEditComponent],
    imports: [
        CommonModule,
        TituteRoutingModule,
        ReusableComponentModule,
        MaterialModule,
        FormsModule
    ]
})
export class TituteModule { }

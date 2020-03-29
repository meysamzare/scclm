import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TituteRoutingModule } from './titute-routing.module';
import { TituteComponent } from './titute.component';
import { ReusableComponentModule } from '../../../shared/reusable-component/reusable-component.module';
import { TituteListComponent } from './titute-list/titute-list.component';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
    declarations: [TituteComponent, TituteListComponent],
    imports: [
        CommonModule,
        TituteRoutingModule,
        ReusableComponentModule,
        MaterialModule
    ]
})
export class TituteModule { }

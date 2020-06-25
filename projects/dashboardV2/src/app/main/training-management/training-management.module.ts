import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingManagementRoutingModule } from './training-management-routing.module';
import { TrainingManagementComponent } from './training-management.component';
import { ReusableComponentModule } from '../../shared/reusable-component/reusable-component.module';


@NgModule({
    declarations: [TrainingManagementComponent],
    imports: [
        CommonModule,
        TrainingManagementRoutingModule,
        ReusableComponentModule
    ]
})
export class TrainingManagementModule { }

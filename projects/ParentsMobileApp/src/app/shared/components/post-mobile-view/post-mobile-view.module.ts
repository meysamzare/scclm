import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HPostViewComponent } from './hpost-view/hpost-view.component';
import { MobileAdvertisingComponent } from './mobile-advertising/mobile-advertising.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { MobileScheduleViewComponent } from './mobile-schedule-view/mobile-schedule-view.component';
import { CountdownTimerModule } from 'ngx-countdown-timer';



@NgModule({
    declarations: [
        HPostViewComponent,
        MobileAdvertisingComponent,
        MobileScheduleViewComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        CountdownTimerModule
    ],
    exports: [
        HPostViewComponent,
        MobileAdvertisingComponent,
        MobileScheduleViewComponent
    ]
})
export class PostMobileViewModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HPostViewComponent } from './hpost-view/hpost-view.component';
import { MobileAdvertisingComponent } from './mobile-advertising/mobile-advertising.component';
import { MaterialModule } from 'src/app/shared/material.module';



@NgModule({
    declarations: [
        HPostViewComponent,
        MobileAdvertisingComponent
    ],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        HPostViewComponent,
        MobileAdvertisingComponent
    ]
})
export class PostMobileViewModule { }

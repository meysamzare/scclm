import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineClassMobileListComponent } from './online-class-mobile-list/online-class-mobile-list.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { OnlineClassMobileItemComponent } from './online-class-mobile-list/online-class-mobile-item/online-class-mobile-item.component';



@NgModule({
    declarations: [OnlineClassMobileListComponent, OnlineClassMobileItemComponent],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [OnlineClassMobileListComponent, OnlineClassMobileItemComponent]
})
export class OnlineClassModule { }

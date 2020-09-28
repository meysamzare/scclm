import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LongpressDirective } from '../longpress.directive';



@NgModule({
    declarations: [
        LongpressDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LongpressDirective
    ]
})
export class LongPressModule { }

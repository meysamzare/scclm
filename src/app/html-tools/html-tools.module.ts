import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ShuffleArrayPipe } from './shuffle-array.pipe';



@NgModule({
    declarations: [SafeHtmlPipe, ShuffleArrayPipe],
    imports: [
        CommonModule
    ],
    exports: [SafeHtmlPipe, ShuffleArrayPipe]
})
export class HtmlToolsModule { }

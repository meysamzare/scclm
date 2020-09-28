import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ShuffleArrayPipe } from './shuffle-array.pipe';
import { PictureSelectModalComponent } from './picture-select-modal/picture-select-modal.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule } from '@angular/forms';
import { AddPicturesModalComponent } from './add-pictures-modal/add-pictures-modal.component';
import { AddPictureGroupComponent } from '../Dashboard/WebSiteManagment/gallery/picture/picture-edit/add-picture-group/add-picture-group.component';
import { RouterModule } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { BootstrapModule } from '../shared/bootstrap/bootstrap.module';
import { LongPressModule } from 'projects/ParentsMobileApp/src/app/shared/directives/long-press/long-press.module';



@NgModule({
    declarations: [
        SafeHtmlPipe, 
        ShuffleArrayPipe, 
        PictureSelectModalComponent, 
        AddPicturesModalComponent,
        AddPictureGroupComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        RouterModule,
        NgxDropzoneModule,
        NgSelectModule,
        BootstrapModule,
        LongPressModule
    ],
    exports: [SafeHtmlPipe, 
        ShuffleArrayPipe, 
        PictureSelectModalComponent, 
        AddPicturesModalComponent,
        AddPictureGroupComponent
    ],
    entryComponents: [
        PictureSelectModalComponent
    ]
})
export class HtmlToolsModule { }

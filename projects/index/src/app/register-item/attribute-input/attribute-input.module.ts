import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeInputComponent } from './attribute-input/attribute-input.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { ImageIconModule } from 'projects/ParentsMobileApp/src/app/shared/components/image-icon/image-icon/image-icon.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { HtmlToolsModule } from 'src/app/html-tools/html-tools.module';



@NgModule({
    declarations: [AttributeInputComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ImageIconModule,
        CKEditorModule,
        HtmlToolsModule
    ],
    exports: [AttributeInputComponent]
})
export class AttributeInputModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeInputComponent } from './attribute-input/attribute-input.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageIconModule } from 'projects/ParentsMobileApp/src/app/shared/components/image-icon/image-icon/image-icon.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { HtmlToolsModule } from 'src/app/html-tools/html-tools.module';
import { CustomEditorModule } from 'src/app/shared/components/custom-editor/custom-editor.module';
import { CodeMeliValidatorDirective } from './code-meli-validator.directive';
import { RegisterItemLoadingProgressComponent } from './register-item-loading-progress/register-item-loading-progress.component';
import { BootstrapModule } from 'src/app/shared/bootstrap/bootstrap.module';
import { UniqAttrValueValidatorDirective } from './uniq-attr-value-validator.directive';
import { PhoneNumberValidatorDirective } from './phone-number-validator.directive';



@NgModule({
    declarations: [AttributeInputComponent, CodeMeliValidatorDirective, RegisterItemLoadingProgressComponent, UniqAttrValueValidatorDirective, PhoneNumberValidatorDirective],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        ImageIconModule,
        CKEditorModule,
        HtmlToolsModule,
        CustomEditorModule,
        BootstrapModule
    ],
    exports: [AttributeInputComponent, RegisterItemLoadingProgressComponent]
})
export class AttributeInputModule { }

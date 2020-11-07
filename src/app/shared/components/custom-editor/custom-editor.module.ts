import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomEditorComponent } from './custom-editor/custom-editor.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatProgressBarModule } from '@angular/material';
import { SpeechRecognitionDialogComponent } from './speech-recognition-dialog/speech-recognition-dialog.component';


@NgModule({
    declarations: [CustomEditorComponent, SpeechRecognitionDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        CKEditorModule,
        MatProgressBarModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule
    ],
    exports: [CustomEditorComponent]
})
export class CustomEditorModule { }

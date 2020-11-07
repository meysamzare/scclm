import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SpeechRecognitionService } from '../speech-recognition.service';

@Component({
    selector: 'app-speech-recognition-dialog',
    templateUrl: './speech-recognition-dialog.component.html',
    styleUrls: ['./speech-recognition-dialog.component.scss']
})
export class SpeechRecognitionDialogComponent implements OnInit, OnDestroy {

    content = "";
    tempContent = "";

    isStarted = false;

    constructor(
        private dialogRef: MatDialogRef<SpeechRecognitionDialogComponent>,
        private spttService: SpeechRecognitionService,
        @Inject(MAT_DIALOG_DATA) private data,
    ) { }

    ngOnDestroy(): void {

    }

    ngOnInit() {
    }

    activeSpeechRecognition(): void {
        this.spttService.record().subscribe(value => {
            if (value.complate) {
                this.content += ` ${value.data}`;
                this.tempContent = "";
            } else {
                this.tempContent = value.data;
            }
        }, err => {
            if (err.error == "no-speech") {
                console.log("--restatring service--");
                this.activeSpeechRecognition();
            }

            if (err == "internet") {

            }
        }, () => {
            this.spttService.stop();
        });
    }

    toggle() {
        if (this.isStarted) {
            this.spttService.stop();
        } else {
            this.activeSpeechRecognition();
        }
        this.isStarted = !this.isStarted;
    }

}

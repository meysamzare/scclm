import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-add-pictures-modal',
    templateUrl: './add-pictures-modal.component.html',
    styleUrls: ['./add-pictures-modal.component.scss']
})
export class AddPicturesModalComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<AddPicturesModalComponent>,
    ) { }

    ngOnInit() {
    }

    closeNodal() {
        this.dialogRef.close(true);
    }

}

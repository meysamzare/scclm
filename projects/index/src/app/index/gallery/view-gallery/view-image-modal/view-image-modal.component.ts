import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-view-image-modal',
    templateUrl: './view-image-modal.component.html',
    styleUrls: ['./view-image-modal.component.scss']
})
export class ViewImageModalComponent implements OnInit {

    PicUrl = "";

    constructor(
        public dialogRef: MatDialogRef<ViewImageModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.PicUrl = this.data.url;
    }

    ngOnInit() { }

}

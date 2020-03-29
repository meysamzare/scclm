import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    templateUrl: './tree-dialog.component.html',
    styleUrls: ['./tree-dialog.component.scss']
})
export class TreeDialogComponent implements OnInit {

    Url = "";
    Title = "";

    constructor(
        public dialogRef: MatDialogRef<TreeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.Url = data.url;
        this.Title = data.title;
    }

    ngOnInit() {
    }

}
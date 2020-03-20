import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";


@Component({
    templateUrl: "./show-image.component.html"
})
export class ShowImageComponent{
    
    constructor(
        public dialogRef: MatDialogRef<ShowImageComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {}
}
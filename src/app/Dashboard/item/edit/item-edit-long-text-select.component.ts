import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";


@Component({
    templateUrl: "./item-edit-long-text-select.component.html"
})
export class ItemEditLongTextSelectComponent {
    constructor(
        public dialogRef: MatDialogRef<ItemEditLongTextSelectComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {}
}
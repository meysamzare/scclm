import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TreeDialogComponent } from './tree-dialog/tree-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class TreeService {

    constructor(
        public dialog: MatDialog
    ) { }

    openTreeDialog(url: string, title: string) {
        this.dialog.open(TreeDialogComponent, {
            data: {
                title: title,
                url: url
            }
        });
    }
}
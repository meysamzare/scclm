import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TreeDialogComponent } from './tree.component';

@Injectable({
    providedIn: 'root'
})
export class TreeService {

    constructor(
        private dialog: MatDialog
    ) { }

    openTreeDialog(url, title) {
        this.dialog.open(TreeDialogComponent, {
            data: {
                url: url,
                title: title,
            }
        });
    }
}
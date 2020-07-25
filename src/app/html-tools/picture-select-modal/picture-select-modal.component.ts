import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, finalize } from 'rxjs/operators';
import { AddPicturesModalComponent } from '../add-pictures-modal/add-pictures-modal.component';
import { ShowImageComponent } from 'src/app/shared/Modal/show-image.component';

@Component({
    selector: 'app-picture-select-modal',
    templateUrl: './picture-select-modal.component.html',
    styleUrls: ['./picture-select-modal.component.scss']
})
export class PictureSelectModalComponent implements OnInit {

    isLoading = true;

    refreshData$ = new Subject();

    page = 1;

    searchText = "";
    pictures = [];
    totalItems = 0;

    constructor(
        private dialogRef: MatDialogRef<PictureSelectModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data,
        public auth: AuthService,
        private dialog: MatDialog
    ) {
        this.refreshData();
    }

    ngOnInit() {
        this.refreshData$.pipe(
            debounceTime(700)
        ).subscribe(() => this.refreshData(true));
    }

    canShowMoreButton(): boolean {
        var nowItemCount = this.pictures.length;
        var nowPage = this.page + 1;
        var totalItemCount = this.totalItems;

        if (nowItemCount < totalItemCount) {
            return true;
        }

        return false;
    }

    nextPage() {
        this.page += 1;

        this.refreshData();
    }

    refreshData(clearList = false) {
        this.isLoading = true;

        if (clearList) {
            this.page = 1;
        }

        let obj = {
            searchText: this.searchText,
            page: this.page
        };

        this.auth.post("/api/Picture/getForModal", obj).pipe(
            finalize(() => this.isLoading = false)
        ).subscribe(data => {
            if (data.success) {

                if (clearList) {
                    this.pictures = [];
                }

                this.totalItems = +data.type;

                var pictures: any[] = data.data;
                pictures.forEach(pic => {
                    this.pictures.push(pic);
                });

            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    returnPicture(url) {
        let picElement = `<p> <img src="${url}"> </p>`;

        this.dialogRef.close(picElement);
    }

    openAddPicturesModal() {
        const dialog = this.dialog.open(AddPicturesModalComponent);

        dialog.afterClosed().subscribe(result => {
            if (result) {
                this.refreshData(true)
            }
        });
    }

    showImagePopUp(url) {
        const dialog = this.dialog.open(ShowImageComponent, {
            data: {
                url: url
            }
        });
    }
}

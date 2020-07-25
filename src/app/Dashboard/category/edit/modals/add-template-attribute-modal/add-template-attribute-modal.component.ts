import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-add-template-attribute-modal',
    templateUrl: './add-template-attribute-modal.component.html',
    styleUrls: ['./add-template-attribute-modal.component.scss']
})
export class AddTemplateAttributeModalComponent implements OnInit {

    catId = 0;

    refreshData$ = new Subject();

    isLoading = true;
    tempAttrs = [];

    page = 1;
    searchText = "";
    totalItems = 0;

    stayOnPage = false;

    constructor(
        public dialogRef: MatDialogRef<AddTemplateAttributeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) {
        this.catId = data.catId;

        this.refreshTempAttrs(true);
    }

    ngOnInit() {
        this.refreshData$.pipe(
            debounceTime(700)
        ).subscribe(() => this.refreshTempAttrs(true));
    }


    canShowMoreButton(): boolean {
        let nowItemCount = this.tempAttrs.length;
        let totalItemCount = this.totalItems;

        if (nowItemCount < totalItemCount) {
            return true;
        }

        return false;
    }

    nextPage() {
        this.page += 1;

        this.refreshTempAttrs();
    }

    refreshTempAttrs(clearList = false) {
        this.isLoading = true;

        if (clearList) {
            this.page = 1;
        }

        let obj = {
            searchText: this.searchText,
            page: this.page
        };

        this.auth.post("/api/Attribute/getTemps", obj)
            .pipe(finalize(() => this.isLoading = false))
        .subscribe(data => {
            if (data.success) {
                if (clearList) {
                    this.tempAttrs = [];
                }

                this.totalItems = +data.type;

                var tempAttrs: any[] = data.data;
                tempAttrs.forEach(attr => {
                    this.tempAttrs.push(attr);
                });
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    addAttributeTempForCat(attrId) {

        let obj = { attrId: attrId, catId: this.catId };

        this.auth.post("/api/Attribute/AddAttributeTempForCat", obj, {
            type: 'Add',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Add Attribute from Attribute Temp For Cat (Modal)',
            logSource: 'dashboard',
            object: obj,
            table: "Attribute",
            tableObjectIds: [attrId, this.catId]
        }).subscribe(data => {
            if (data.success) {
                this.auth.message.showSuccessAlert();

                if (!this.stayOnPage) {
                    this.dialogRef.close(true);
                }

            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

}

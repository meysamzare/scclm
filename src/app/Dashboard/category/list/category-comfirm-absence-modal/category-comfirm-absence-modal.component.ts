import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './category-comfirm-absence-modal.component.html',
    styleUrls: ['./category-comfirm-absence-modal.component.scss']
})
export class CategoryComfirmAbsenceModalComponent implements OnInit {

    isLoadingAbsence = false;


    catId = 0;
    catTitle = "";
    calculateNegativeScore = false;

    saveScoreType = 3;

    deleteUnknownDatas = false;

    constructor(
        public dialogRef: MatDialogRef<CategoryComfirmAbsenceModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) { }

    ngOnInit() {
        this.catId = this.data.catId;
        this.catTitle = this.data.catTitle;
        this.calculateNegativeScore = this.data.calculateNegativeScore;
    }

    absenceForOnlineExam() {

        this.isLoadingAbsence = true;

        const obj = {
            catId: this.catId,
            saveScoreType: this.saveScoreType,
            deleteUnknownDatas: this.deleteUnknownDatas
        };

        this.auth.post("/api/Category/AbsenceForOnlineExam", obj, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Absence For OnlineExam',
            logSource: 'dashboard',
            object: obj,
            oldObject: null,
            table: "Category",
            tableObjectIds: [obj.catId]
        }).pipe(finalize(() => this.isLoadingAbsence = false)).subscribe(data => {
            if (data.success) {
                this.auth.message.showSuccessAlert("حضور و غیاب آزمون با موفقیت انجام شد");

                this.dialogRef.close(true);
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

}

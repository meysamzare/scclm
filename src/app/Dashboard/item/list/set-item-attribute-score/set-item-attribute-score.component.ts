import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IItemAttr } from '../../item-attr';

@Component({
    selector: 'app-set-item-attribute-score',
    templateUrl: './set-item-attribute-score.component.html',
    styleUrls: ['./set-item-attribute-score.component.scss']
})
export class SetItemAttributeScoreComponent implements OnInit {

    itemAttribute: IItemAttr = null;
    currentScore: number = null;
    maxScore: number = null;

    constructor(
        public dialogRef: MatDialogRef<SetItemAttributeScoreComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) {
        this.itemAttribute = data.itemAttr;
        this.currentScore = data.currentScore;
        this.maxScore = data.maxScore;
    }

    ngOnInit() {
    }

    setScore() {
        this.auth.post("/api/Item/SetItemAttributeScore", {
            itemAttr: this.itemAttribute,
            score: this.currentScore
        }).subscribe(data => {
            if (data.success) {
                this.auth.message.showSuccessAlert();

                this.dialogRef.close(true);
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }
}

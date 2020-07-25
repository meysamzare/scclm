import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
    selector: 'app-add-group-question-modal',
    templateUrl: './add-group-question-modal.component.html',
    styleUrls: ['./add-group-question-modal.component.scss']
})
export class AddGroupQuestionModalComponent implements OnInit {

    catId = 0;

    isLoading = false;

    selectedGradeForCourse = null;
    selectedCourseForQuestion = null;
    hardQuestionNumber = null;
    mediumQuestionNumber = null;
    easyQuestionNumber = null;

    grades = [];
    courses = [];

    constructor(
        public dialogRef: MatDialogRef<AddGroupQuestionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) {
        this.catId = data.catId;
    }

    ngOnInit() {
        this.auth.post("/api/Grade/getAll", null).subscribe(data => {
            if (data.success) {
                this.grades = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/Course/getAll").subscribe(data => {
            if (data.success) {
                this.courses = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        });
    }

    getCourseByGrade() {
        let gradeId = this.selectedGradeForCourse;

        if (gradeId) {
            return this.courses.filter(c => c.gradeId == gradeId);
        }

        return [];
    }


    addRandomQuestions() {
        this.isLoading = true;

        this.auth.post("/api/Category/AddRandomQuestionAttribute", {
            catId: this.catId,
            selectedCourseForQuestion: this.selectedCourseForQuestion,
            hardQuestionNumber: this.hardQuestionNumber,
            mediumQuestionNumber: this.mediumQuestionNumber,
            easyQuestionNumber: this.easyQuestionNumber,
        }).pipe(
            finalize(() => this.isLoading = false)
        ).subscribe(data => {
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

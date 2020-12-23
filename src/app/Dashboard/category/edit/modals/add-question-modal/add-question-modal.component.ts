import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
    selector: 'app-add-question-modal',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './add-question-modal.component.html',
    styleUrls: ['./add-question-modal.component.scss']
})
export class AddQuestionModalComponent implements OnInit {

    catId = 0;
    selectedGrade = null;
    selectedCourse = null;
    selectedDefct = null;

    grades = [];
    courses = [];

    refreshData$ = new Subject();

    isLoading = true;
    questions = [];

    page = 1;
    searchText = "";
    totalItems = 0;

    stayOnPage = true;

    addedQuestionsIds = [];

    constructor(
        public dialogRef: MatDialogRef<AddQuestionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) {
        this.catId = data.catId;
        this.selectedGrade = data.selectedGrade;
        this.selectedCourse = data.selectedCourse;

        this.refreshQuestions();
    }

    ngOnInit() {
        this.refreshData$.pipe(
            debounceTime(700)
        ).subscribe(() => this.refreshQuestions(true));

        this.isLoading = true;
        this.auth.post("/api/Category/getQuestionIds", this.catId)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(data => {
                if (data.success) {
                    this.addedQuestionsIds = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

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
        let gradeId = this.selectedGrade;

        if (gradeId) {
            return this.courses.filter(c => c.gradeId == gradeId);
        }

        return [];
    }



    canShowMoreButton(): boolean {
        let nowItemCount = this.questions.length;
        let totalItemCount = this.totalItems;

        if (nowItemCount < totalItemCount) {
            return true;
        }

        return false;
    }

    nextPage() {
        this.page += 1;

        this.refreshQuestions();
    }

    refreshQuestions(clearList = false) {
        this.isLoading = true;

        if (clearList) {
            this.page = 1;
        }

        let obj = {
            searchText: this.searchText,
            page: this.page,
            selectedGrade: this.selectedGrade,
            selectedCourse: this.selectedCourse,
            selectedDefct: this.selectedDefct
        };

        this.auth.post("/api/Question/getQuestions", obj)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(data => {
                if (data.success) {
                    if (clearList) {
                        this.questions = [];
                    }

                    this.totalItems = +data.type;

                    var questions: any[] = data.data;
                    questions.forEach(question => {
                        this.questions.push(question);
                    });
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
    }

    isContainsAddedQuestionIds(id) {
        return this.addedQuestionsIds.some(c => c == id);
    }

    addQuestionForCat(questionId) {
        let obj = {
            catId: this.catId,
            questionId: questionId
        };

        this.isLoading = true;

        this.auth.post("/api/Attribute/AddQuestionForCat", obj, {
            type: 'Add',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Add Attribute from Attribute Temp For Cat (Modal)',
            logSource: 'dashboard',
            object: obj,
            table: "Attribute",
            tableObjectIds: [questionId, this.catId]
        })
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(data => {
                if (data.success) {
                    this.auth.message.showSuccessAlert();

                    this.addedQuestionsIds.push(questionId);

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

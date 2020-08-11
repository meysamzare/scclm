import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { finalize } from 'rxjs/internal/operators/finalize';
import { IQuestion } from 'src/app/Dashboard/Question/question/question';

@Component({
    selector: 'app-add-question-modal',
    templateUrl: './add-question-modal.component.html',
    styleUrls: ['./add-question-modal.component.scss']
})
export class AddQuestionModalComponent implements OnInit {

    catId = 0;

    refreshData$ = new Subject();

    isLoading = true;
    questions = [];

    page = 1;
    searchText = "";
    totalItems = 0;

    stayOnPage = false;

    addedQuestionsIds = [];

    constructor(
        public dialogRef: MatDialogRef<AddQuestionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) {
        this.catId = data.catId;

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
            page: this.page
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IQuestion } from '../question/question';

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

    questions: IQuestion[] = [];
    totalCount = 0;

    grades = [];
    courses = [];
    
    selectedGrade = null;
    selectedCourse = null;

    selectedDefct = null;

    isLoading = false;

    txtSearch = "";

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.auth.post("/api/Grade/getAll").subscribe(data => {
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
        const gradeId = this.selectedGrade;

        if (gradeId) {
            return this.courses.filter(c => c.gradeId == gradeId);
        }

        return [];
    }

    refreshQuestions() {

        this.isLoading = true;
        
        const obj = {
            getparams: {
                sort: "id",
                direction: "desc",
                pageIndex: this.paginator.pageIndex || 0,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            },
            selectedGrade: this.selectedGrade,
            selectedCourse: this.selectedCourse,
            selectedDefct: this.selectedDefct
        };

        this.auth.post("/api/Question/Get", obj, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Question',
            logSource: 'dashboard',
            object: obj,
            table: "Question"
        }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {
                this.totalCount = +data.type;
                this.questions = data.data;

            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

}

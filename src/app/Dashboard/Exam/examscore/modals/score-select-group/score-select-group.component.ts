import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IExam } from "../../../exam/exam";
import { IClass } from "src/app/Dashboard/class/class";
import { IGrade } from "src/app/Dashboard/grade/grade";
import { SetScoreGroupModalComponent } from "../set-score-group/set-score-group.component";
import { IWorkbook } from "src/app/Dashboard/workbook/workbook";



@Component({
    templateUrl: "./score-select-group.component.html",
    styles: [
        `
            .ng-dropdown-panel {
                display: contents;
            }
        `
    ]
})
export class ScoreSelectGroupModalComponent implements OnInit {
    exams: IExam[] = [];
    examId: number = null;

    classes: IClass[] = [];
    selectedClass: number = null;

    grades: IGrade[] = [];
    selectedGrade: number = null;

    workbooks: IWorkbook[] = [];
    selectedWorkbook: number = null;

    selectedExam: IExam = new IExam();

    
    constructor(
        public dialogRef: MatDialogRef<ScoreSelectGroupModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.auth.post("/api/Exam/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.exams = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );

        this.auth.post("/api/Grade/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.grades = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/Class/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.classes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/Workbook/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.workbooks = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    
    getFiltredClass() {
        var gradeId = this.selectedGrade;
        if (gradeId) {
            return this.classes.filter(c => c.gradeId == gradeId)
        }

        return this.classes;
    }
    
    getFiltredExam() {
        var exams = this.exams;

        if (this.selectedGrade) {
            exams = exams.filter(c => c.gradeId == this.selectedGrade);
        }

        if (this.selectedClass) {
            exams = exams.filter(c => c.gradeId == this.selectedClass);
        }

        if (this.selectedWorkbook) {
            if (this.selectedWorkbook == 0) {
                exams = exams.filter(c => c.workbookId == null);
            } else {
                exams = exams.filter(c => c.workbookId == this.selectedWorkbook);
            }
        }

        return exams;
    }

    getSelectedExam() {
        if (this.examId) {
            this.auth.post("/api/Exam/getExam", this.examId).subscribe(data => {
                if (data.success) {
                    this.selectedExam = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }


    openSetScoreGroupModal() {
        const dialog = this.dialog.open(SetScoreGroupModalComponent, {
            data: {
                examId: this.examId
            }
        });

        dialog.afterClosed().subscribe(data => {

        });
    }
}
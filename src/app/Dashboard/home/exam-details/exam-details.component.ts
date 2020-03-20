import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { IExamScore } from '../../Exam/examscore/examscore';
import { IExam } from '../../Exam/exam/exam';
import { IStudent } from '../../student/student';

@Component({
    templateUrl: './exam-details.component.html',
    styleUrls: ['./exam-details.component.scss']
})
export class ExamDetailsComponent implements OnInit {

    examScores: IExamScore[] = [];
    exam: IExam = new IExam();
    students: IStudent[] = [];

    isLoading = true;

    constructor(
        public dialogRef: MatDialogRef<ExamDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService
    ) { }

    ngOnInit() {

        var examid = this.data.examId;

        this.auth.post("/api/Exam/getExam", examid).subscribe(
            (data: jsondata) => {
                this.exam = data.data;
            },
            er => {
                this.auth.handlerError(er);
            }
        );

        this.auth.post("/api/ExamScore/getAllByExamId", this.data.examId).subscribe(data => {
            if (data.success) {
                this.examScores = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });


        this.auth.post("/api/Student/getStudentForExamScore", examid).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.students = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            },
            () => {
                this.isLoading = false;
            }
        );
    }


    getStudentScore(stdid) {
        var StdScore = this.examScores.find(c => c.studentId == stdid);

        if (StdScore) {
            if (StdScore.state == 1) {
                return "غائب و موجه";
            }
            if (StdScore.state == 2) {
                return "غائب و غیر موجه";
            }
            return StdScore.score;
        } else {
            return "---";
        }
    }

    getAvgOfScores() {

        var count = 0;
        var sum = 0;

        this.students.forEach(std => {
            var escor = this.examScores.find(c => c.studentId == std.id);

            if (escor && escor.state == 0) {
                sum += escor.score;

                count += 1;
            }

        });

        if (sum == 0) {
            return 0;
        }

        return (sum / count).toFixed(2);
    }

}

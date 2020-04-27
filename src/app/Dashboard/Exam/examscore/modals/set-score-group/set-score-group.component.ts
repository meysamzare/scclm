import { Component, Inject, OnInit, HostListener, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IStudent } from "src/app/Dashboard/student/student";
import { IExamScore } from "../../examscore";
import { IExam } from "../../../exam/exam";
import { finalize } from "rxjs/operators";


@Component({
    templateUrl: "./set-score-group.component.html"
})
export class SetScoreGroupModalComponent implements OnInit {


    students: IStudent[] = [];

    exam: IExam;

    examscore: IExamScore = new IExamScore();

    examScores: IExamScore[] = [];

    studentName = "";

    isScoreValid = false;

    // 0.5 0.25 0.75
    checkScoreAfterPoint = false;

    examId: number;

    isLoading = false;

    @ViewChild("fi1", { static: true }) file: ElementRef;

    constructor(
        public dialogRef: MatDialogRef<SetScoreGroupModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService
    ) { }

    ngOnInit(): void {

        var examid = this.data.examId;
        this.examId = examid;

        this.examscore.examId = examid;
        this.examscore.trueAnswer = 0;
        this.examscore.falseAnswer = 0;
        this.examscore.blankAnswer = 0;


        this.auth.post("/api/Exam/getExam", examid).subscribe(
            (data: jsondata) => {
                this.exam = data.data;

                this.examscore.numberQ = this.exam.numberQ;
                this.examscore.topScore = this.exam.topScore;

            },
            er => {
                this.auth.handlerError(er);
            }
        );


        this.auth.post("/api/Student/getStudentForExamScore", examid).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.students = data.data;

                    if (this.students.length != 0) {
                        this.refreshExamScores(true);
                    } else {
                        this.message.showWarningAlert("دانش آموزی برای این آزمون یافت نشد");
                        this.dialogRef.close(false);
                    }

                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );


    }

    onExamScoreStateChange() {
        if (this.examscore.state != 0) {
            this.examscore.score = null;
        } else {

        }
    }

    getStudentName() {
        var student = this.examscore.studentId ? this.students[this.students.findIndex(c => c.id == this.examscore.studentId)] : null;

        if (student) {
            return student.name + ' ' + student.lastName;
        }

        return "";
    }

    getStudentScore(stdid) {
        var StdScore = this.examScores.find(c => c.studentId == stdid);

        if (StdScore) {
            switch (StdScore.state) {
                case 0:
                    return StdScore.score;
                case 1:
                    return "غائب و موجه";
                case 2:
                    return "غائب و غیر موجه";
            }
        }

        return "---";
    }

    isUserAccessToEdit() {
        return this.auth.isUserAccess("edit_ExamScore", false);
    }

    isStudentHaveScore(stdId) {
        var stdScore = this.examScores.find(c => c.studentId == stdId);

        if (stdScore) {

            if (this.isUserAccessToEdit()) {
                return false;
            }

            return true;
        }

        return false;
    }


    checkForScore(value) {
        if (value > this.exam.topScore) {
            this.message.showWarningAlert(
                "نمره نمیتواند از ملاک آزمون بیشتر باشد"
            );
            this.isScoreValid = false;

            return;
        }

        this.isScoreValid = true;
        return;
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

    isAfterPointScoreValid(): boolean {
        var score = this.examscore.score ? this.examscore.score.toFixed(2).toString() : null;

        if (this.checkScoreAfterPoint && score) {
            if (score.endsWith(".25") || score.endsWith(".50") || score.endsWith(".75") || score.endsWith(".00")) {
                return true;
            }

            return false;
        } else {
            return true;
        }

    }

    refreshExamScores(firstRun?) {

        this.auth.post("/api/ExamScore/getAllByExamId", this.data.examId).subscribe(data => {
            if (data.success) {
                this.examScores = data.data;

                if (firstRun) {
                    this.setNewExamScoreByStudent(this.students[0].id)
                }
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    setNewExamScoreByStudent(stdId) {
        this.examscore.studentId = stdId;

        var stdExamScore = this.examScores.find(c => c.studentId == stdId);

        if (stdExamScore) {
            this.examscore.state = stdExamScore.state;
        }
    }


    @HostListener("document:keydown.control.arrowright")
    moveToNextStudent() {
        var nowIndex = this.students.findIndex(
            c => c.id == this.examscore.studentId
        );

        if (this.students.length - 1 == nowIndex) {
            this.message.showInfoAlert("دانش آموزی باقی نمانده است", "");
        } else {
            this.setNewExamScoreByStudent(this.students[nowIndex + 1].id);
        }

    }

    @HostListener("document:keydown.control.arrowleft")
    moveToPerevStudent() {
        var nowIndex = this.students.findIndex(
            c => c.id == this.examscore.studentId
        );

        if (nowIndex === 0) {
            this.message.showInfoAlert("دانش آموزی باقی نمانده است", "");
        } else {
            this.setNewExamScoreByStudent(this.students[nowIndex - 1].id);
        }

    }

    getEnteringScoreSheet() {
        this.auth.post("/api/ExamScore/getEnteringScoreSheet", this.examId, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Get Entring Score Excel Sheet',
            logSource: 'dashboard',
            object: {
                examId: this.examId
            },
            table: "ExamScore",
            tableObjectIds: [this.examId]
        }).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    var win = window.open(this.auth.apiUrl + data.redirect.substr(1), '_blank');
                    win.focus();
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    uploadScoreSheet(files: FileList) {
        var fileToUpload = files.item(0);

        if (fileToUpload) {
            let reader = new FileReader();
            reader.readAsDataURL(fileToUpload);
            reader.onload = () => {
                let result = reader.result.toString().split(",")[1];

                var obj = {
                    fileValue: result,
                    fileName: fileToUpload.name,
                    fileType: fileToUpload.type
                }

                this.isLoading = true;

                this.auth.post("/api/ExamScore/setScoreFromSheet", obj, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Import ExamScore from Excel file',
                    logSource: 'dashboard',
                    object: {
                        fileName: fileToUpload.name,
                        fileType: fileToUpload.type
                    },
                    table: "ExamScore"
                }).pipe(
                    finalize(() => {
                        this.isLoading = false;
                        this.file.nativeElement.value = null;
                    })
                ).subscribe((data: jsondata) => {
                    if (data.success) {
                        this.message.showSuccessAlert("رکورد های موجود با موفقیت ثبت شدند");
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }

                    this.refreshExamScores();
                }, er => {
                    this.auth.handlerError(er)
                });
            }
        }
    }

    sts() {
        if (
            (this.examscore.state == 0 && (this.examscore.score != null || this.examscore.score < this.examscore.topScore)) ||
            (this.examscore.state != 0 && this.examscore.score == null)
        ) {
            if (!this.examscore.score && this.examscore.state == 0) {
                this.message.showErrorAlert("نمره را وارد کنید");
                return;
            }
            if (!this.isScoreValid && this.examscore.state == 0) {
                this.message.showWarningAlert("نمره نمیتواند از ملاک آزمون بیشتر باشد");
                return;
            }

            if (this.isAfterPointScoreValid()) {

                this.auth.post(`/api/ExamScore/${this.isUserAccessToEdit() ? 'AddOrUpdate' : 'Add'}`, this.examscore, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Add(Update) ExamScore From Modal',
                    logSource: 'dashboard',
                    object: this.examscore,
                    table: "ExamScore",
                    tableObjectIds: [this.examscore.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.refreshExamScores();
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }

                        this.examscore.score = null;

                        var nowIndex = this.students.findIndex(
                            c => c.id == this.examscore.studentId
                        );

                        if (this.students.length - 1 == nowIndex) {
                            // this.dialogRef.close(true);
                        } else {
                            this.examscore.studentId = this.students[
                                nowIndex + 1
                            ].id;
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );

            }
        }
    }



}
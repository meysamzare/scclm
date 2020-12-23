import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IGrade } from '../../grade/grade';
import { IStudent } from '../student';
import { IExamType } from '../../Exam/examtype/examtype';
import { ICourse } from '../../course/course';
import { IExam } from '../../Exam/exam/exam';
import { IExamScore } from '../../Exam/examscore/examscore';
import { IClassBook, ClassBookType, getClassBookTypeString, getClassBookResult } from '../class-book/class-book';
import { getTitleByNumber, getTypeByNumber } from '../Score/ScoreThemplate/score-themplate';
import { IStudentScore } from '../Score/StudentScore/student-score';
import { StdClassMng } from '../stdClassMng';
import { IWorkbook } from '../../workbook/workbook';
import { StudentWorkbookResult, WorkbookResultService } from '../../workbook/workbook-result.service';

@Component({
    selector: 'app-student-study-record',
    templateUrl: './student-study-record.component.html',
    styleUrls: ['./student-study-record.component.scss']
})
export class StudentStudyRecordComponent implements OnInit {

    registredStudent: IStudent[] = [];
    studentGrades: IGrade[] = [];
    coursesByGrade: ICourse[] = [];
    examByGrade: IExam[] = [];
    examScoreByGrade_Student: IExamScore[] = [];
    registredStdClassMngs: StdClassMng[] = [];

    selectedGrade: number = null;
    selectedClass: number = null;
    selectedStudent: number = null;
    selectedStdClassMng: number = null;

    comformedStudent: IStudent = new IStudent();

    examTypes: IExamType[] = [];

    classBooksByStdGrade: IClassBook[] = [];

    studentScoreByStdGrade: IStudentScore[] = [];

    selectedWorkBook: number = null;

    workbooks: IWorkbook[] = [];

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService,
        private workbookResultService: WorkbookResultService
    ) {
        this.auth.post("/api/StdClassMng/getAllRegistredStudent").subscribe(data => {
            if (data.success) {
                this.registredStudent = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/ExamType/getAll").subscribe(data => {
            if (data.success) {
                this.examTypes = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/Workbook/getAll").subscribe(data => {
            if (data.success) {
                this.workbooks = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    studentSelected() {
        this.selectedGrade = null;
        this.selectedClass = null;

        if (this.selectedStudent) {

            this.auth.post("/api/Student/getStudent", this.selectedStudent).subscribe(data => {
                if (data.success) {
                    this.comformedStudent = data.data.student;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            // this.auth.post("/api/StdClassMng/getRegistredGradeByStudent", this.selectedStudent).subscribe(data => {
            //     if (data.success) {
            //         this.studentGrades = data.data;
            //     } else {
            //         this.message.showMessageforFalseResult(data);
            //     }
            // }, er => {
            //     this.auth.handlerError(er);
            // });

            this.auth.post("/api/StdClassMng/getAllbyStd", this.selectedStudent).subscribe(data => {
                if (data.success) {
                    this.registredStdClassMngs = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });


        }
    }

    workbookResult: StudentWorkbookResult = null;

    clearWorkbook() {
        this.workbookResult = null;
    }

    async onWorkbookSelect() {
        if (this.selectedWorkBook) {
            var classId = this.registredStdClassMngs.find(c => c.isActive).classId;
            if (!classId) {
                return this.auth.message.showErrorAlert("این دانش آموز سال تحصیلی فعالی ندارد!");
            }

            const obj = {
                studentId: this.selectedStudent,
                gradeId: this.selectedGrade,
                classId: classId,
                workbookId: this.selectedWorkBook
            }

            this.workbookResult = await this.workbookResultService.getStudnetWorkbook(this.selectedStudent, this.selectedGrade, classId, this.selectedWorkBook,
                {
                    type: 'View',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'View Student Workbook',
                    logSource: 'dashboard',
                    object: obj,
                    table: "Student",
                    tableObjectIds: [this.selectedStudent]
                });
        }
    }

    gradeSelected() {
        if (this.selectedStdClassMng && this.selectedStudent) {

            var stdClassMng = this.registredStdClassMngs.find(c => c.id == this.selectedStdClassMng);

            this.selectedClass = stdClassMng.classId;
            this.selectedGrade = stdClassMng.gradeId;

            this.auth.post("/api/Course/getAllByGrade", this.selectedGrade, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Student StudyRecord',
                logSource: 'dashboard',
                object: {
                    studentId: this.selectedStudent,
                    gradeId: this.selectedGrade
                },
                table: "Student",
                tableObjectIds: [this.selectedStudent]
            }).subscribe(data => {
                if (data.success) {
                    this.coursesByGrade = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/ExamScore/getAllByGrade_Student", {
                studentId: this.selectedStudent,
                gradeId: this.selectedGrade
            }).subscribe(data => {
                if (data.success) {
                    this.examScoreByGrade_Student = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/Exam/getAllByClass", this.selectedClass).subscribe(data => {
                if (data.success) {
                    this.examByGrade = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/ClassBook/getAllByStd_Grade", {
                studentId: this.selectedStudent,
                gradeId: this.selectedGrade
            }).subscribe(data => {
                if (data.success) {
                    this.classBooksByStdGrade = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/StudentScore/getAllByStudent_Grade", {
                studentId: this.selectedStudent,
                gradeId: this.selectedGrade
            }).subscribe(data => {
                if (data.success) {
                    this.studentScoreByStdGrade = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

        }
    }

    getExamsByCourse(courseId) {
        return this.examByGrade.filter(c => c.courseId == courseId);
    }

    getExamScoreForExam(examId): {
        scoreText: string,
        scoreNumber: number,
        scoreState: number,
        color: string
    } {
        var examScore = this.examScoreByGrade_Student.find(c => c.examId == examId);

        var result = {
            scoreText: null,
            scoreNumber: 0,
            scoreState: 0,
            color: "unset"
        }

        if (examScore) {

            result.scoreState = examScore.state;

            if (examScore.state == 0) {
                result.scoreNumber = examScore.score;
                result.scoreText = examScore.score;
                return result;
            }

            if (examScore.state == 1) {
                result.scoreText = "غائب و موجه";
                result.color = "yellow";
                return result;
            }

            if (examScore.state == 2) {
                result.scoreText = "غائب و غیرموجه";
                result.color = "orange";
                return result;
            }

            return result;
        }

        result.scoreText = "نمره این دانش آموز ثبت نشده است";
        return result;
    }

    getRaitingForScore(examId) {
        var examScore = this.examScoreByGrade_Student.find(c => c.examId == examId);

        if (examScore) {
            return examScore.rating;
        }

        return "----";
    }

    getExamsByExamType(examTypeId) {
        return this.examByGrade.filter(c => c.examTypeId == examTypeId);
    }

    isAnyExamByExamType(examTypeId) {
        var exams = this.getExamsByExamType(examTypeId);

        if (exams.length == 0) {
            return false;
        }

        return true;
    }

    getClassBooksByType(clsBookType) {
        return this.classBooksByStdGrade.filter(c => c.type == clsBookType);
    }

    isAnyClassBookByType(clsBookType) {
        var classBooks = this.getClassBooksByType(clsBookType);

        if (classBooks.length == 0) {
            return false;
        }

        return true;
    }

    getClassBookTypeString(type) {
        return getClassBookTypeString(type);
    }

    getClassBookResult(type: ClassBookType, value: string) {
        return getClassBookResult(type, value, "", false);
    }

    getStudentScoreTitleString(titleInNumber) {
        return getTitleByNumber(titleInNumber);
    }

    getStudentScoreTypeString(typeInNumber) {
        return getTypeByNumber(typeInNumber);
    }

    getStudentScoreByTitleNumber(title) {
        var titleString = this.getStudentScoreTitleString(title);

        return this.studentScoreByStdGrade.filter(c => c.title == titleString);
    }

    isAnyStudentScoreByTitle(title) {
        var studentScores = this.getStudentScoreByTitleNumber(title);

        if (studentScores.length == 0) {
            return false;
        }

        return true;
    }

    clearPage() {
        this.selectedStudent = null;

        this.comformedStudent = new IStudent();
    }

    ngOnInit() {
    }

}

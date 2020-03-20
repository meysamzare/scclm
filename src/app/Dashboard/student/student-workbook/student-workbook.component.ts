import { Component, OnInit } from '@angular/core';
import { IStudent } from '../student';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IGrade } from '../../grade/grade';
import { ICourse } from '../../course/course';
import { IExamScore } from '../../Exam/examscore/examscore';
import { IExam } from '../../Exam/exam/exam';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { IExamType } from '../../Exam/examtype/examtype';

@Component({
    selector: 'app-student-workbook',
    templateUrl: './student-workbook.component.html',
    styleUrls: ['./student-workbook.component.scss']
})
export class StudentWorkbookComponent implements OnInit {

    registredStudent: IStudent[] = [];

    studentGrades: IGrade[] = [];


    selectedStudent: number = null;
    selectedGrade: number = null;
    comformedStudent: IStudent = new IStudent();


    coursesByGrade: ICourse[] = [];
    examByGrade: IExam[] = [];
    examScoreByGrade_Student: IExamScore[] = [];

    examTypes: IExamType[] = [];
    selectedExamType: number = null;
    startDate: string = null;
    endDate: string = null;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService
    ) { }

    ngOnInit() {
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
    }

    studentSelected() {
        this.selectedGrade = null;

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

            this.auth.post("/api/StdClassMng/getRegistredGradeByStudent", this.selectedStudent).subscribe(data => {
                if (data.success) {
                    this.studentGrades = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

    gradeSelected() {
        if (this.selectedGrade && this.selectedStudent) {

            this.auth.post("/api/Course/getAllByGrade", this.selectedGrade, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Student Workbook',
                logSource: 'dashboard',
                object: {
                    studentId: this.selectedStudent,
                    gradeId: this.selectedGrade
                },
            }).subscribe(data => {
                if (data.success) {
                    this.coursesByGrade = data.data;


                    this.auth.post("/api/Exam/getAllByGrade", this.selectedGrade).subscribe(data => {
                        if (data.success) {
                            this.examByGrade = data.data;


                            this.auth.post("/api/ExamScore/getAllByGrade_Student", {
                                studentId: this.selectedStudent,
                                gradeId: this.selectedGrade
                            }).subscribe(data => {
                                if (data.success) {
                                    this.examScoreByGrade_Student = data.data;

                                    this.updateCourseChartData();
                                } else {
                                    this.message.showMessageforFalseResult(data);
                                }
                            }, er => {
                                this.auth.handlerError(er);
                            });


                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    }, er => {
                        this.auth.handlerError(er);
                    });


                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

        }
    }

    openc(p) {
        p.open();
    }



    getExamsByCourse(courseId) {
        return this.examByGrade.filter(c => c.courseId == courseId);
    }

    getExamScoreForExam(examId) {
        return this.examScoreByGrade_Student.find(c => c.examId == examId && c.studentId == this.selectedStudent);
    }

    canShowChart(courseId, checkForAbsent = false) {
        var haveAnyScore: boolean[] = [];
        var exams = this.getExamsByCourse(courseId);

        exams.forEach(exam => {
            if (checkForAbsent) {
                if (this.getExamScoreForExam(exam.id) && this.getExamScoreForExam(exam.id).state == 0) {
                    haveAnyScore.push(true);
                }
            } else {
                if (this.getExamScoreForExam(exam.id)) {
                    haveAnyScore.push(true);
                }
            }
        });

        if (haveAnyScore.length == 0 || exams.length == 0) {
            return false;
        }

        return true;
    }



    getJustifiedScore(score: number, topScore: number) {
        let mix = (20 / topScore);

        return (score * mix);
    }


    datas: Array<ChartDataSets[]> = [];
    datasLable: Array<Label[]> = [];

    updateCourseChartData() {

        this.datas = [];
        this.datasLable = [];

        this.coursesByGrade.forEach((course, indexCourse) => {

            var exams = this.getExamsByCourse(course.id);

            if (exams.length != 0) {

                this.datas[indexCourse] = [
                    { data: [], label: "نمره دانش آموز", borderDash: [10, 5] },
                    { data: [], label: "میانگین ", borderDash: [10, 5] },
                    { data: [], label: "بیشترین ", borderDash: [10, 5], borderColor: "green", backgroundColor: "rgba(0, 255, 0, 0.3)" },
                    { data: [], label: "کمترین ", borderDash: [10, 5], borderColor: "black", backgroundColor: "rgba(0, 0, 0, 0.1)" }
                ];

                this.datasLable[indexCourse] = [];
            }

            exams.forEach((exam, indexExam) => {
                if (this.getExamScoreForExam(exam.id)) {
                    this.datas[indexCourse][0].data.push(this.getJustifiedScore(this.getExamScoreForExam(exam.id).score, exam.topScore));
                    this.datas[indexCourse][1].data.push(this.getJustifiedScore(exam.avgInExam, exam.topScore));
                    this.datas[indexCourse][2].data.push(this.getJustifiedScore(exam.maxInExam, exam.topScore));
                    this.datas[indexCourse][3].data.push(this.getJustifiedScore(exam.minInExam, exam.topScore));

                    this.datasLable[indexCourse].push(exam.dateString);
                }
            });

        })
    }

    clearSearch() {
        this.endDate = null;
        this.startDate = null;

        this.updateStudentEducationChartData();
    }


    getExamBetweenDatesForEducationChart() {
        this.auth.post("/api/Exam/getExamBetweenDates", {
            dateStart: this.startDate,
            dateEnd: this.endDate,
            examTypeId: this.selectedExamType
        }).subscribe(data => {
            if (data.success) {
                this.updateStudentEducationChartData(data.data);
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }


    studentEducationDatas: ChartDataSets[] = [
        { data: [], label: "نمره دانش آموز" },
        { data: [], label: "میانگین کلاس" }
    ];
    studentEducationDatasLabel: Label[] = [];

    courseChartDataSort: "max" | "min" = "max";

    updateStudentEducationChartData(examsIds?: number[]) {

        this.studentEducationDatas = [
            { data: [], label: "نمره دانش آموز" },
            { data: [], label: "میانگین کلاس" }
        ];
        this.studentEducationDatasLabel = [];

        if (this.selectedExamType) {

            var examByType = this.examByGrade.filter(c => c.examTypeId == this.selectedExamType);

            if (examsIds) {

                examByType = [];

                examsIds.forEach(examId => {
                    var exam = this.examByGrade.find(c => c.id == examId);

                    if (exam) {
                        examByType.push(exam);
                    }

                });
            } else {
                this.endDate = null;
                this.startDate = null;
            }

            var courses: courseChartData_StudentEducation[] = [];

            examByType.forEach(exam => {
                var examCourseId = exam.courseId;

                var course = courses.find(c => c.courseId == examCourseId);
                if (this.getExamScoreForExam(exam.id)) {
                    if (course) {
                        course.count += 1;
                    } else {
                        courses.push({
                            courseId: examCourseId,
                            courseName: this.coursesByGrade.find(c => c.id == examCourseId).name,
                            count: 1
                        });
                    }
                }
            });

            let courseChartTemp: courseChartDataTemp[] = [];

            courses.forEach(course => {

                var sumStudentScore: number = 0;
                var sumAvg: number = 0;

                examByType.filter(c => c.courseId == course.courseId).forEach(exam => {
                    if (this.getExamScoreForExam(exam.id)) {
                        sumStudentScore += this.getExamScoreForExam(exam.id).score;
                        sumAvg += exam.avgInExam;
                    }
                });

                var studentEducationDatas_AVG = (sumStudentScore / course.count);
                var sumAvg_AVG = (sumAvg / course.count);

                courseChartTemp.push({
                    stdScore: studentEducationDatas_AVG,
                    classAvg: sumAvg_AVG,
                    lable: course.courseName
                });

            });

            courseChartTemp.sort((a, b) => {
                if (a.stdScore > b.stdScore) {
                    return this.courseChartDataSort == "min" ? 1 : -1;
                } else {
                    return this.courseChartDataSort == "min" ? -1 : 1;
                }
            });

            courseChartTemp.forEach(temp => {
                this.studentEducationDatas[0].data.push(temp.stdScore);
                this.studentEducationDatas[1].data.push(temp.classAvg);

                this.studentEducationDatasLabel.push(temp.lable);
            });
        }
    }


}

interface courseChartData_StudentEducation {
    courseId: number;
    courseName: string;
    count: number;
}

class courseChartDataTemp {
    stdScore: number;
    classAvg: number;

    lable: string;
}
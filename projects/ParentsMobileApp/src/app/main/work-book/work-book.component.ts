import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/services/message.service';
import { ThemeService } from '../../service/theme.service';
import { StudentAuthService } from '../../service/parent-student-auth.service';
import { IGrade } from 'src/app/Dashboard/grade/grade';
import { ICourse } from 'src/app/Dashboard/course/course';
import { IExam } from 'src/app/Dashboard/Exam/exam/exam';
import { IExamScore } from 'src/app/Dashboard/Exam/examscore/examscore';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { IWorkbook } from 'src/app/Dashboard/workbook/workbook';
import { IClassBook, getClassBookTypeString, ClassBookType, getClassBookResult } from 'src/app/Dashboard/student/class-book/class-book';
import { IExamType } from 'src/app/Dashboard/Exam/examtype/examtype';

@Component({
    selector: 'app-work-book',
    templateUrl: './work-book.component.html',
    styleUrls: ['./work-book.component.scss']
})
export class WorkBookComponent implements OnInit {

    registredGrades: IGrade[] = [];
    selectedGrade: number = null;

    coursesByGrade: ICourse[] = [];
    selectedCourse: number = null;

    examsByGrade: any[] = [];

    examScoreByGrade: any[] = [];

    classBooks: IClassBook[] = [];

    stdId = this.stdAuth.getStudent().id;

    testObject = {
        name: "11",
        last: 12
    }

    ViewState: "workbook" | "exams" | "examType" = "exams";

    isLoading = true;

    selectedWorkbook: number = null;

    workbooks: IWorkbook[] = [];

    examTypes: IExamType[] = [];
    selectedExamType: number = null;

    constructor(
        private message: MessageService,
        private theme: ThemeService,
        public stdAuth: StudentAuthService
    ) { }

    ngOnInit() {

        this.stdAuth.auth.post("/api/StdClassMng/getRegistredGradeByStudent", this.stdId, {
            type: 'View',
            agentId: this.stdAuth.getStudent().id,
            agentType: 'StudentParent',
            agentName: this.stdAuth.getStudentFullName(),
            tableName: 'Entring WorkBook Page',
            logSource: 'PMA',
            object: null,
            table: "Workbook"
        }).subscribe(data => {
            if (data.success) {
                this.registredGrades = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        }, () => {
            this.isLoading = false;
        });


        this.stdAuth.auth.post("/api/Workbook/getAll").subscribe(data => {
            if (data.success) {
                this.workbooks = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        });

        this.stdAuth.auth.post("/api/ExamType/getAll").subscribe(data => {
            if (data.success) {
                this.examTypes = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
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

            var examByType = this.examsByGrade.filter(c => c.examTypeId == this.selectedExamType);

            if (examsIds) {

                examByType = [];

                examsIds.forEach(examId => {
                    var exam = this.examsByGrade.find(c => c.id == examId);

                    if (exam) {
                        examByType.push(exam);
                    }

                });
            } else {
                // this.endDate = null;
                // this.startDate = null;
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


    totalAvgTitle: string = "معدل کل";
    coursesHeaders: string[] = [];
    courseAvgs: number[] = [];
    totalAvg: number = 0;

    ratingsInClass: number[] = [];
    ratingsInGrade: number[] = [];

    ratingOfTotalAvgClass: number = 0;
    ratingOfTotalAvgGrade: number = 0;
    avgOfTotalAvrageGrade: number = 0;
    topTotalAvrageGrade: number = 0;


    onWorkBookSelect(selectedWorkbook) {
        if (selectedWorkbook != "null") {
            this.isLoading = true;
            this.stdAuth.auth.post("/api/ExamScore/getTotalAverageByStudentGrade", {
                studentId: this.stdId,
                gradeId: this.selectedGrade,
                classId: this.stdAuth.getActiveStdClassMng().classId,
                workbookId: this.selectedWorkbook
            }, {
                type: 'View',
                agentId: this.stdAuth.getStudent().id,
                agentType: 'StudentParent',
                agentName: this.stdAuth.getStudentFullName(),
                tableName: 'Student Average Workbook',
                logSource: 'PMA',
                object: {
                    stdName: this.stdAuth.getStudentFullName(),
                    studentId: this.stdId,
                    gradeId: this.selectedGrade,
                    classId: this.stdAuth.getActiveStdClassMng().classId,
                    workbookId: this.selectedWorkbook
                },
                table: "Workbook"
            }).subscribe(data => {
                if (data.success) {

                    var headers: string[] = data.data.headers;
                    var courseAvgs: number[] = data.data.courseAvgs;
                    var totalAvg: number = data.data.totalAvg;
                    var ratingsInClass: number[] = data.data.ratingsInClass;
                    var ratingsInGrade: number[] = data.data.ratingsInGrade;

                    var ratingOfTotalAvgClass: number = data.data.ratingOfTotalAvgClass;
                    var ratingOfTotalAvgGrade: number = data.data.ratingOfTotalAvgGrade;
                    var avgOfTotalAvrageGrade: number = data.data.avgOfTotalAvrageGrade;
                    var topTotalAvrageGrade: number = data.data.topTotalAvrageGrade;

                    var maxLength = Math.max(...(headers.map(c => c.length)));

                    headers.forEach((value, index, array) => {
                        array[index] = array[index].padEnd(maxLength);
                    });

                    this.totalAvgTitle = this.totalAvgTitle.padEnd(maxLength + 1);

                    this.coursesHeaders = headers;
                    this.courseAvgs = courseAvgs;
                    this.totalAvg = totalAvg;

                    this.ratingsInClass = ratingsInClass;
                    this.ratingsInGrade = ratingsInGrade;
                    this.ratingOfTotalAvgClass = ratingOfTotalAvgClass;
                    this.ratingOfTotalAvgGrade = ratingOfTotalAvgGrade;
                    this.avgOfTotalAvrageGrade = avgOfTotalAvrageGrade;
                    this.topTotalAvrageGrade = topTotalAvrageGrade;

                } else {
                    this.stdAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.stdAuth.auth.handlerError(er);
            }, () => {
                this.isLoading = false;
            });
        }
    }

    getBackColorOfPanel(avg, stdAvg) {
        if (stdAvg >= avg) {
            return "#aaff70";
        } else {
            return "#ff7070";
        }
    }

    getShowWorkbook() {
        return this.workbooks.filter(c => c.isShow == true);
    }

    getExamsByWorkbook(workbookId) {
        return this.examsForSelectedCourse.filter(c => c.workbookId == workbookId);
    }

    onGradeSelect(selectedGrade) {
        if (selectedGrade != "null") {

            this.selectedCourse = null;

            this.isLoading = true;


            this.stdAuth.auth.post("/api/ClassBook/getAllByStd_Grade", {
                studentId: this.stdAuth.getStudent().id,
                gradeId: this.selectedGrade
            }).subscribe(data => {
                if (data.success) {
                    this.classBooks = data.data;
                } else {
                    this.stdAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.stdAuth.auth.handlerError(er);
            });

            this.stdAuth.auth.post("/api/Course/getAllByGrade", this.selectedGrade).subscribe(data => {
                if (data.success) {
                    this.coursesByGrade = data.data;


                    this.stdAuth.auth.post("/api/Exam/getAllByGrade", this.selectedGrade).subscribe(data => {
                        if (data.success) {

                            var exams: any[] = data.data;

                            this.examsByGrade = exams.filter(c => c.canShowByWorkBook == true);


                            this.stdAuth.auth.post("/api/ExamScore/getAllByGrade_Student", {
                                studentId: this.stdId,
                                gradeId: this.selectedGrade
                            }, {
                                type: 'View',
                                agentId: this.stdAuth.getStudent().id,
                                agentType: 'StudentParent',
                                agentName: this.stdAuth.getStudentFullName(),
                                tableName: 'Select StudentGrade in WorkBook Page (maybe Chart is Shown)',
                                logSource: 'PMA',
                                object: {
                                    studentId: this.stdId,
                                    gradeId: this.selectedGrade
                                },
                                table: "Workbook"
                            }).subscribe(data => {
                                if (data.success) {
                                    this.examScoreByGrade = data.data;

                                    this.updateCourseChartData();
                                } else {
                                    this.message.showMessageforFalseResult(data);
                                }
                            }, er => {
                                this.stdAuth.auth.handlerError(er);
                            }, () => {
                                this.isLoading = false;
                            });


                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    }, er => {
                        this.stdAuth.auth.handlerError(er);
                    });


                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.stdAuth.auth.handlerError(er);
            });
        }
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


    getExamsByCourse(courseId) {
        return this.examsByGrade.filter(c => c.courseId == courseId);
    }

    getExamScoreForExam(examId) {
        return this.examScoreByGrade.find(c => c.examId == examId && c.studentId == this.stdId);
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


    chartDataByCourse: ChartDataSets[] = [];
    chartLabelByCourse: Label[] = [];

    examsForSelectedCourse: IExam[] = [];

    classBookForSelectedCourse: IClassBook[] = [];

    onCourseSelect(selectedCourse) {
        if (selectedCourse != "null") {
            this.chartDataByCourse = this.getChartDataByCourse(this.selectedCourse);
            this.chartLabelByCourse = this.getChartLabelByCourse(this.selectedCourse);

            this.examsForSelectedCourse = this.examsByGrade.filter(c => c.courseId == this.selectedCourse);

            this.classBookForSelectedCourse = this.classBooks.filter(c => c.courseId == selectedCourse);
        }
    }

    getChartDataByCourse(courseId): ChartDataSets[] {
        var courseIndex = this.coursesByGrade.findIndex(c => c.id == courseId);

        return this.datas[courseIndex];
    }

    getChartLabelByCourse(courseId): Label[] {
        var courseIndex = this.coursesByGrade.findIndex(c => c.id == courseId);

        return this.datasLable[courseIndex];
    }




    getClassBookTypeString(type) {
        return getClassBookTypeString(type);
    }

    getClassBooksByType(type) {
        return this.classBookForSelectedCourse.filter(c => c.type == type);
    }

    getClassBookResult(type: ClassBookType, value: string) {
        return getClassBookResult(type, value, "", false);
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
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { StdClassMng } from 'src/app/Dashboard/student/stdClassMng';
import { IStudentDailySchedule } from './student-daily-schdule/student-daily-schdule';
import { StudentDailyScheduleService } from './student-daily-schdule/student-daily-schedule.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ViewCatDetailTokenService } from '../view-cat-detail/view-cat-detail-token.service';
import { StudentWorkbookResult, WorkbookResultService } from 'src/app/Dashboard/workbook/workbook-result.service';

@Component({
    selector: 'app-work-book',
    templateUrl: './work-book.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./work-book.component.scss']
})
export class WorkBookComponent implements OnInit {

    stdClassMngs: StdClassMng[] = [];
    selectedStdClassMng: number = null;

    selectedGrade: number = null;

    coursesByGrade: ICourse[] = [];
    selectedCourse: number = null;

    studentDailySchedules: IStudentDailySchedule[] = [];

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
        public stdAuth: StudentAuthService,
        private studentDailyScheduleService: StudentDailyScheduleService,
        private viewCatDetailTokenService: ViewCatDetailTokenService,
        private workbookResultService: WorkbookResultService
    ) { }

    ngOnInit() {

        this.studentDailyScheduleService.refreshDatas$.subscribe(() => {
            this.refreshStudentDailySchedule();
        });

        this.stdAuth.auth.post("/api/StdClassMng/getAllRegisteredByStudent", this.stdId, {
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
                this.stdClassMngs = data.data;
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

    workbookResult: StudentWorkbookResult = null;


    async onWorkBookSelect(selectedWorkbook) {
        if (selectedWorkbook != "null") {
            this.isLoading = true;

            this.workbookResult = await this.workbookResultService.getStudnetWorkbook(this.stdId, this.selectedGrade, this.stdAuth.getActiveStdClassMng().classId, this.selectedWorkbook,
                {
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
                });

            var maxLength = Math.max(...(this.workbookResult.headers.map(c => c.length)));

            this.workbookResult.headers.forEach((value, index, array) => {
                array[index] = array[index].padEnd(maxLength);
            });

            this.totalAvgTitle = this.totalAvgTitle.padEnd(maxLength + 1);

            this.isLoading = false;
        }
    }

    getBackColorOfPanel() {
        if (this.workbookResult.isTotalAvgBiggerThanAvgOfTotalAvg) {
            return "#acf57aa1";
        } else {
            return "#ff6363a1";
        }
    }

    getShowWorkbook() {
        return this.workbooks.filter(c => c.isShow == true);
    }

    getExamsByWorkbook(workbookId) {
        return this.examsForSelectedCourse.filter(c => c.workbookId == workbookId);
    }

    refreshStudentDailySchedule() {
        if (this.selectedGrade) {
            this.stdAuth.auth.post("/api/StudentDailySchedule/getAllByStd", {
                studentId: this.stdAuth.getStudent().id,
                stdClassMngId: this.selectedStdClassMng
            }).subscribe(data => {
                if (data.success) {
                    this.studentDailySchedules = data.data;
                } else {
                    this.stdAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.stdAuth.auth.handlerError(er);
            });
        }
    }

    setStudentDailyScheduleState(id, state) {
        this.isLoading = true;

        this.stdAuth.auth.post("/api/StudentDailySchedule/SetState", {
            id: id,
            state: state
        }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {
                this.stdAuth.auth.message.showSuccessAlert();
                this.refreshStudentDailySchedule();
            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        });
    }

    getSDSBackgroundColor(type) {

        if (type == 2) {
            return "#41a141";
        }
        if (type == 3) {
            return "#a74242";
        }
        if (type == 4) {
            return "#a7a442";
        }

        return "";
    }

    onGradeSelect() {
        if (this.selectedStdClassMng) {

            let stdClassMng = this.stdClassMngs.find(c => c.id == this.selectedStdClassMng);

            if (stdClassMng) {

                this.selectedGrade = stdClassMng.gradeId;

                this.selectedCourse = null;

                this.isLoading = true;

                this.refreshStudentDailySchedule();

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
            } else {
                this.selectedGrade = null;
            }
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

    getExamScoreForExam(examId): any {
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
                    this.datas[indexCourse][0].data.unshift(this.getJustifiedScore(this.getExamScoreForExam(exam.id).score, exam.topScore));
                    this.datas[indexCourse][1].data.unshift(this.getJustifiedScore(exam.avgInExam, exam.topScore));
                    this.datas[indexCourse][2].data.unshift(this.getJustifiedScore(exam.maxInExam, exam.topScore));
                    this.datas[indexCourse][3].data.unshift(this.getJustifiedScore(exam.minInExam, exam.topScore));

                    this.datasLable[indexCourse].unshift(exam.dateString);
                }
            });

        })
    }


    chartDataByCourse: ChartDataSets[] = [];
    chartLabelByCourse: Label[] = [];

    examsForSelectedCourse: any[] = [];

    classBookForSelectedCourse: IClassBook[] = [];

    onCourseSelect() {
        const selectedCourse = this.selectedCourse;
        if (selectedCourse) {
            this.chartDataByCourse = this.getChartDataByCourse(this.selectedCourse);
            this.chartLabelByCourse = this.getChartLabelByCourse(this.selectedCourse);

            this.examsForSelectedCourse = this.examsByGrade.filter(c => c.courseId == this.selectedCourse);

            this.classBookForSelectedCourse = this.classBooks.filter(c => c.courseId == selectedCourse);
        }
    }

    getSelectedCourseTitle() {
        const selectedCourse = this.selectedCourse;
        const course = this.coursesByGrade.find(c => c.id == selectedCourse);

        if (course) {
            return course.name;
        }

        return "---"
    }

    getWorkbookJustifiedName(workbookName: string) {
        const staticStringLenght = 17;
        const staticSpaceLength = 3;

        if (workbookName) {

            const workBookNameLength = workbookName.length;

            if (workBookNameLength >= staticStringLenght) {
                return workbookName.substring(0, staticStringLenght) + Array(staticSpaceLength).fill(".").join("");
            }

            return workbookName + Array((staticStringLenght + staticSpaceLength) - workBookNameLength).fill(" ").join("");
        }

        return Array(staticStringLenght + staticSpaceLength).fill(" ").join("");
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


    getOnlineExamId(id: string) {
        return id.slice(2);
    }

    getItemId(id: string) {
        return id.slice(3);
    }

    isLoadingOnlineExamData = false;

    loadOnlineExamData(id: string) {
        const catId = this.getOnlineExamId(id);

        this.isLoadingOnlineExamData = true;

        this.stdAuth.auth.post("/api/Exam/getOnlineExamFullData", catId)
            .pipe(finalize(() => this.isLoadingOnlineExamData = false)).subscribe(data => {
                if (data.success) {
                    const exam = this.examsByGrade.find(c => c.id == id);
                    if (exam) {
                        this.examsByGrade[this.examsByGrade.indexOf(exam)] = data.data;

                        this.updateCourseChartData();

                        this.onCourseSelect();

                        this.message.showSuccessAlert("داده ها با موفقیت بارگذاری شدند");
                    }
                } else {
                    this.stdAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.stdAuth.auth.handlerError(er);
            });
    }

    getCatDetailViewToken(catId: number, itemId: number) {
        return this.viewCatDetailTokenService.getToken(catId, itemId);
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
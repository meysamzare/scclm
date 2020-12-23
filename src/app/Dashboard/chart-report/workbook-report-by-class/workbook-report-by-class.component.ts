import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IWorkbook } from '../../workbook/workbook';
import { IGrade } from '../../grade/grade';
import { IClass } from '../../class/class';
import { ICourse } from '../../course/course';
import { MatTableDataSource, MatSort } from '@angular/material';
import { IDescriptiveScore } from '../../Exam/descriptive-score/descriptive-score';
import { WorkbookResultService } from '../../workbook/workbook-result.service';

@Component({
    selector: 'app-workbook-report-by-class',
    templateUrl: './workbook-report-by-class.component.html',
    styleUrls: ['./workbook-report-by-class.component.scss']
})
export class WorkbookReportByClassComponent implements OnInit, AfterViewInit {

    workbooks: IWorkbook[] = [];
    selectedWorkbook: number = null;

    grades: IGrade[] = [];
    selectedGrade: number = null;

    classes: IClass[] = [];
    selectedClass: number = null;

    onlyShowCourseHaveScore = false;

    isLoading = false;

    constructor(
        public auth: AuthService,
        private workbookResultService: WorkbookResultService
    ) { }


    ngOnInit() {

        this.auth.post("/api/Workbook/getAll").subscribe(data => {
            if (data.success) {
                this.workbooks = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/Grade/getAll").subscribe(data => {
            if (data.success) {
                this.grades = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

    }

    onGradeSelect() {
        if (this.selectedGrade) {

            this.auth.post("/api/Class/getClassByGrade", this.selectedGrade).subscribe(data => {
                if (data.success) {
                    this.classes = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

        }
    }


    datas: {
        title: string,
        courses: ICourse[],
        results: WorkbookDetailResult[],
        displayedColumns: string[],
        dataSource: MatTableDataSource<WorkbookDetailResult>,
        courseScores: { courseId: string, courseScore: number }[],
        isDescriptiveScore: boolean;
    }[] = [];

    @ViewChildren(MatSort) sorts: QueryList<MatSort>;

    ngAfterViewInit(): void {
        this.sorts.changes.subscribe((matSorts: QueryList<MatSort>) => {
            if (this.datas.length != 0 && matSorts.first) {
                this.datas.forEach((data, index) => {
                    data.dataSource.sort = matSorts.toArray()[index];
                });
            }
        });
    }

    async addData() {
        if (this.selectedWorkbook && this.selectedGrade) {

            let workbookName = this.workbooks.find(c => c.id == this.selectedWorkbook).name;
            let gradeName = this.grades.find(c => c.id == this.selectedGrade).name;

            let title = "";

            if (this.selectedClass) {
                let className = this.classes.find(c => c.id == this.selectedClass).name;
                title = `${workbookName} - ${gradeName} - ${className}`;
            } else {
                title = `${workbookName} - ${gradeName}`;
            }

            let any = this.datas.find(c => c.title == title);

            if (any) {
                this.auth.message.showWarningAlert("این داده قبلا وارد شده است");
                return;
            }

            this.isLoading = true;

            const descScoreData = await this.auth.post("/api/DescriptiveScore/getAll").toPromise();

            const descriptiveScores: IDescriptiveScore[] = descScoreData.data;

            const obj = {
                workbookId: this.selectedWorkbook,
                gradeId: this.selectedGrade,
                classId: this.selectedClass,
                onlyShowCourseHaveScore: this.onlyShowCourseHaveScore
            };

            this.auth.post("/api/ExamScore/getWorkbookDetail", obj, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Add Workbook Class Report to report list',
                logSource: 'dashboard',
                object: obj,
                table: "WorkbookByClassComparison"
            }).subscribe(data => {
                if (data.success) {
                    let courses: ICourse[] = data.data.courses;
                    let results: WorkbookDetailResult[] = data.data.results;
                    let isDescriptiveScore: boolean = data.data.isDescriptiveScore;

                    let dspCols = ['rate', 'name', 'totalAvg'];

                    courses.forEach(course => {
                        let courseId = course.id.toString();
                        dspCols.push(courseId);
                    });

                    let courseScores: { courseId: string, courseScore: number }[] = [];

                    results.forEach((result, index, resultArray) => {

                        if (isDescriptiveScore) {
                            resultArray[index].totalAvgString = this.workbookResultService.getDescriptiveScoreNameForScore(descriptiveScores, resultArray[index].totalAvg);
                        }

                        courses.forEach((course, courseIndex) => {

                            let courseScore = `${result.courseAvgs[courseIndex].toFixed(2)}`;

                            if (isDescriptiveScore) {
                                courseScore = this.workbookResultService.getDescriptiveScoreNameForScore(descriptiveScores, result.courseAvgs[courseIndex]);
                            }

                            (resultArray as any[])[index][course.id.toString()] = courseScore;

                            courseScores.push({ courseId: course.id.toString(), courseScore: result.courseAvgs[courseIndex] });
                        });
                    });

                    let averageOfCourseAvgs = [];

                    courses.forEach(course => {
                        let avgOfCourse = this.average(courseScores.filter(c => c.courseId == course.id.toString()).map(c => c.courseScore));

                        averageOfCourseAvgs.push(avgOfCourse);
                    });

                    let rs = {
                        name: "معدل دروس",
                        rate: null,
                        totalAvg: this.average(results.map(c => c.totalAvg)),
                        totalAvgString: this.workbookResultService.getDescriptiveScoreNameForScore(descriptiveScores, this.average(results.map(c => c.totalAvg))),
                        courseAvgs: averageOfCourseAvgs,
                        isLast: true
                    };

                    courses.forEach((course, courseIndex) => {
                        rs[course.id.toString()] = rs.courseAvgs[courseIndex].toFixed(2);
                    });


                    results.push(rs);

                    this.datas.unshift({
                        title: title,
                        courses: courses,
                        results: results,
                        displayedColumns: dspCols,
                        dataSource: new MatTableDataSource(results),
                        courseScores: courseScores,
                        isDescriptiveScore: isDescriptiveScore
                    });


                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            }, () => {
                this.isLoading = false;
            });
        }
    }

    onSortChange(event) {
        // console.log(event);
    }

    removeData(index: number) {
        this.datas.splice(index, 1);
    }


    average = (array: number[]) => array ? array.reduce((a, b) => a + b) / array.length : null;

    getRateOfCourse(courseId: number, courseScore: number, courseScores: { courseId: string, courseScore: number }[]) {
        let scores = courseScores.filter(c => c.courseId == courseId.toString()).map(c => c.courseScore);
        let uniqScores = Array.from(new Set(scores)).sort((a, b) => b - a);

        return uniqScores.findIndex(c => c == (courseScore || 0)) + 1;
    }

}

export class WorkbookDetailResult {
    rate: number;
    name: string;
    totalAvg: number;
    totalAvgString: string;
    courseAvgs: number[];
    isLast = false;
}
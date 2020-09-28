import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IWorkbook } from '../../workbook/workbook';
import { IGrade } from '../../grade/grade';
import { IClass } from '../../class/class';
import { ICourse } from '../../course/course';
import { MatTableDataSource, MatSort } from '@angular/material';

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
        courseScores: {courseId: string, courseScore: number}[]
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

    addData() {
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

            let obj = {
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

                    let dspCols = ['rate', 'name', 'totalAvg'];

                    courses.forEach(course => {
                        let courseId = course.id.toString();
                        dspCols.push(courseId);
                    });

                    let courseScores: {courseId: string, courseScore: number}[] = [];

                    results.forEach((result, index, resultArray) => {
                        courses.forEach((course, courseIndex) => {
                            (resultArray as any[])[index][course.id.toString()] = result.courseAvgs[courseIndex];

                            courseScores.push({courseId: course.id.toString(), courseScore: result.courseAvgs[courseIndex]});
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
                        courseAvgs: averageOfCourseAvgs,
                        isLast: true
                    };

                    courses.forEach((course, courseIndex) => {
                        rs[course.id.toString()] = rs.courseAvgs[courseIndex];
                    });


                    results.push(rs);

                    this.datas.unshift({
                        title: title,
                        courses: courses,
                        results: results,
                        displayedColumns: dspCols,
                        dataSource: new MatTableDataSource(results),
                        courseScores: courseScores
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

    getRateOfCourse(courseId: number, courseScore: number, courseScores: {courseId: string, courseScore: number}[]) {
        let scores = courseScores.filter(c => c.courseId == courseId.toString()).map(c => c.courseScore);
        let uniqScores = Array.from(new Set(scores)).sort((a, b) => b - a);

        return uniqScores.findIndex(c => c == courseScore) + 1;
    }

}

export class WorkbookDetailResult {
    rate: number;
    name: string;
    totalAvg: number;
    courseAvgs: number[];
    isLast = false;
}
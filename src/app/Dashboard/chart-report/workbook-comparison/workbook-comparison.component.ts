import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IWorkbook } from '../../workbook/workbook';
import { IStudent } from '../../student/student';
import { StdClassMng } from '../../student/stdClassMng';

@Component({
    selector: 'app-workbook-comparison',
    templateUrl: './workbook-comparison.component.html',
    styleUrls: ['./workbook-comparison.component.scss']
})
export class WorkbookComparisonComponent implements OnInit {

    isLoading = true;

    workbooks: IWorkbook[] = [];
    selectedWorkbook: number = null;

    students: IStudent[] = [];
    selectedStudent: number = null;

    registredStdClassMngs: StdClassMng[] = [];
    selectedStdClassMng: number = null;


    workbookResults: StudentWorkbookType[] = [];

    constructor(
        public auth: AuthService
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

        this.auth.post("/api/StdClassMng/getAllRegistredStudent").subscribe(data => {
            if (data.success) {
                this.students = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        }, () => {
            this.isLoading = false;
        });
    }

    onStudentSelect() {
        if (this.selectedStudent) {
            this.isLoading = true;

            this.auth.post("/api/StdClassMng/getAllbyStd", this.selectedStudent).subscribe(data => {
                if (data.success) {
                    this.registredStdClassMngs = data.data;
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

    addWorkbook() {
        let selectedStdClassMng = this.registredStdClassMngs.find(c => c.id == this.selectedStdClassMng);

        if (!selectedStdClassMng) {
            return;
        }

        let gradeId = selectedStdClassMng.gradeId;
        let gradeName = selectedStdClassMng.gradeName;
        let classId = selectedStdClassMng.classId;
        let className = selectedStdClassMng.className;

        let workbookName = this.workbooks.find(c => c.id == this.selectedWorkbook).name;

        let student = this.students.find(c => c.id == this.selectedStudent);
        let studentName = `${student.name} ${student.lastName}`;

        var obj = {
            studentId: this.selectedStudent,
            gradeId: gradeId,
            classId: classId,
            workbookId: this.selectedWorkbook
        };

        let title = `${studentName} ( ${gradeName} | ${className} ) - ${workbookName}`;

        let any = this.workbookResults.find(c => c.title == title);

        if (any) {
            this.auth.message.showWarningAlert("این داده قبلا وارد شده است");
            return;
        }

        this.isLoading = true;
        this.auth.post("/api/ExamScore/getTotalAverageByStudentGrade", obj, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Add Workbook to WorkbooksComparison List',
            logSource: 'dashboard',
            object: obj,
            table: "WorkbookComparison",
            tableObjectIds: [obj.studentId]
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

                this.workbookResults.push({
                    title: title,
                    coursesHeaders: headers,
                    courseAvgs: courseAvgs,
                    totalAvg: totalAvg,
                    ratingsInClass: ratingsInClass,
                    ratingsInGrade: ratingsInGrade,
                    ratingOfTotalAvgClass: ratingOfTotalAvgClass,
                    ratingOfTotalAvgGrade: ratingOfTotalAvgGrade,
                    avgOfTotalAvrageGrade: avgOfTotalAvrageGrade,
                    topTotalAvrageGrade: topTotalAvrageGrade,
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

    removeWorkbook(index: number) {
        this.workbookResults.splice(index, 1);
    }


}


export class StudentWorkbookType {

    title: string;

    coursesHeaders: string[];
    courseAvgs: number[];
    totalAvg: number;
    ratingsInClass: number[];
    ratingsInGrade: number[];

    ratingOfTotalAvgClass: number;
    ratingOfTotalAvgGrade: number;
    avgOfTotalAvrageGrade: number;
    topTotalAvrageGrade: number;
}
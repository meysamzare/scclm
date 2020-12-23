import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IWorkbook } from '../../workbook/workbook';
import { IStudent } from '../../student/student';
import { StdClassMng } from '../../student/stdClassMng';
import { StudentWorkbookResult, WorkbookResultService } from '../../workbook/workbook-result.service';

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


    workbookResults: {
        title: string,
        workbook: StudentWorkbookResult
    }[] = [];

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

    async addWorkbook() {
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

        const title = `${studentName} ( ${gradeName} | ${className} ) - ${workbookName}`;

        let any = this.workbookResults.find(c => c.title == title);

        if (any) {
            this.auth.message.showWarningAlert("این داده قبلا وارد شده است");
            return;
        }

        this.isLoading = true;

        const obj = {
            studentId: this.selectedStudent,
            gradeId: gradeId,
            classId: classId,
            workbookId: this.selectedWorkbook
        };

        const workbookResult = await this.workbookResultService.getStudnetWorkbook(this.selectedStudent, gradeId, classId, this.selectedWorkbook,
            {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Add Workbook to WorkbooksComparison List',
                logSource: 'dashboard',
                object: obj,
                table: "WorkbookComparison",
                tableObjectIds: [obj.studentId]
            })

        this.workbookResults.push({
            title: title,
            workbook: workbookResult
        });

        this.isLoading = false;

    }

    removeWorkbook(index: number) {
        this.workbookResults.splice(index, 1);
    }


}
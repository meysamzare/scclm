import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IClass } from 'src/app/Dashboard/class/class';
import { IGrade } from 'src/app/Dashboard/grade/grade';
import { IStudent } from 'src/app/Dashboard/student/student';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    templateUrl: './select-student-for-online-class-access-modal.component.html',
    styleUrls: ['./select-student-for-online-class-access-modal.component.scss']
})
export class SelectStudentForOnlineClassAccessModalComponent implements OnInit {

    selectedStudentIds: number[] = [];
    students: any[] = [];

    grades: IGrade[] = [];
    selectedGrade: number = null;

    classesByGrade: IClass[] = [];
    selectedClass: number = null;

    search = "";

    constructor(
        public dialogRef: MatDialogRef<SelectStudentForOnlineClassAccessModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) { }

    ngOnInit() {
        this.auth.post("/api/Grade/getAll").subscribe(data => {
            if (data.success) {
                this.grades = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.refreshStudents();
    }


    onGradeSelected() {
        this.refreshStudents();

        if (this.selectedGrade) {

            this.auth.post("/api/Class/getClassByGrade", this.selectedGrade).subscribe(data => {
                if (data.success) {
                    this.classesByGrade = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

        }
    }

    refreshStudents() {
        this.auth.post("/api/Student/GetByGradeClass", {
            search: this.search,
            gradeId: this.selectedGrade,
            classId: this.selectedClass,
        }).subscribe(data => {
            if (data.success) {
                this.students = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }


    clearAllSelected() {
        this.selectedStudentIds = [];
    }

    selectAllInList() {
        this.students.forEach(agent => {
            var agentId = agent.id;

            var selectedAgent = this.selectedStudentIds.find(c => c == agentId);

            if (!selectedAgent) {
                this.selectedStudentIds.push(agentId);
            }
        });
    }

    isAllSelected(): boolean {
        var selectedCount = this.selectedStudentIds.length;
        var agentsCount = this.students.length;

        if (agentsCount == 0) {
            return false;
        }

        return selectedCount === agentsCount;
    }

    masterToggle() {
        this.isAllSelected() ? this.clearAllSelected() : this.selectAllInList();
    }


    IsIdContainesSelectedAgents(agentId) {
        var selectedAgent = this.selectedStudentIds.find(c => c == agentId);

        if (selectedAgent) {
            return true;
        }

        return false;
    }

    ToggleSelectedAgent(agentId: number) {

        var selectedAgent = this.selectedStudentIds.find(c => c == agentId);

        if (selectedAgent) {
            this.selectedStudentIds.splice(this.selectedStudentIds.findIndex(c => c == agentId), 1);
        } else {
            this.selectedStudentIds.push(agentId);
        }

    }

    getFiltredAgents() {
        if (this.search) {
            return this.sortAgentsBySelection(this.students.filter(c => (`${c.name} ${c.lastName}`).includes(this.search)));
        }

        return this.sortAgentsBySelection(this.students);
    }

    sortAgentsBySelection(students: IStudent[]): any[] {
        return students.sort((a, b) => {
            var aSelected = this.selectedStudentIds.includes(a.id);
            var bSelected = this.selectedStudentIds.includes(b.id);

            if (aSelected < bSelected) {
                return 1;
            } else if (aSelected > bSelected) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    sts() {
        this.dialogRef.close(this.selectedStudentIds);
    }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { StdChangeStateSheetComponent } from 'src/app/Dashboard/student/list/change-state-sheet/change-state-sheet.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DataListComponent } from 'projects/dashboardV2/src/app/shared/reusable-component/data/data-list/data-list.component';
import { getStdStudyStateString, getStdBehaveStateString, getStdPayrollStateString } from 'src/app/Dashboard/student/stdClassMng';
import { getStudentStateString, getStudentStateColorString } from 'src/app/Dashboard/student/student';
import { ChangeStdPasswordComponent } from 'src/app/Dashboard/student/modals/change-std-password/change-std-password.component';
import { StudentRepositoryService } from '../student-repository.service';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {

    @ViewChild("list") dataList: DataListComponent;

    selectedList = [];

    singleStudentView = null;

    constructor(
        private bottomSheet: MatBottomSheet,
        private dialog: MatDialog,
        private studentRepo: StudentRepositoryService
    ) { }

    ngOnInit() {
    }


    addToSelectedList(row) {
        let selected = this.selectedList.find(c => c == row);

        if (!selected) {
            this.selectedList.push(row);
        }
    }

    isOnSelectedList(row): boolean {
        let selected = this.selectedList.find(c => c == row);

        if (selected) {
            return true;
        }

        return false;
    }

    registerStudent(id, fullName) {

    }

    showRegisteredList(id, fullName) {

    }

    async toggleAccess(id, type, checked) {
        let result = await this.studentRepo.toggleAccessByType(id, type == 1 ? "Student" : "StudentParent", checked);

        if (result) {
            this.dataList.refreshDataSource();
        }
    }

    async viewStudent(row) {
        let std = await this.studentRepo.getStudent(row.id);

        if (std) {
            this.singleStudentView = std;
        }
    }

    fastEdit(row) {
        
    }


    openStdChangeStateSheet(id, nowState) {
        const bottomSheet = this.bottomSheet.open(StdChangeStateSheetComponent, {
            data: {
                Id: id,
                nowState: nowState,
                type: 0
            }
        });

        bottomSheet.afterDismissed().subscribe(data => {
            if (data) {
                this.dataList.refreshDataSource();
            }
        })
    }


    openChangePasswordDialog(stdId, stdName, type) {
        const dialog = this.dialog.open(ChangeStdPasswordComponent, {
            data: {
                stdId: stdId,
                stdName: stdName,
                type: type
            },
            direction: "rtl"
        });
    }


    getStdStudyStateString(state) {
        return getStdStudyStateString(state);
    }

    getStdBehaveStateString(state) {
        return getStdBehaveStateString(state);
    }

    getStdPayrollStateString(state) {
        return getStdPayrollStateString(state);
    }

    getStudentStateString(state) {
        return getStudentStateString(state);
    }
    getStudentStateColorString(state) {
        return getStudentStateColorString(state);
    }

}

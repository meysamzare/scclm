import { Component, Inject, OnInit } from "@angular/core";
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialog,
    MatBottomSheet
} from "@angular/material";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { RegisterStudentModalComponent } from "../register-student/register-student.component";
import { StdClassMng, getStdStudyStateString, getStdBehaveStateString, getStdPayrollStateString, getStdStudyStateColorString, getStdBehaveStateColorString, getStdPayrollStateColorString } from "../../stdClassMng";
import { StdChangeStateSheetComponent } from "../../list/change-state-sheet/change-state-sheet.component";

@Component({
    templateUrl: "./registred-list.component.html"
})
export class RegistredListStudentModalComponent implements OnInit {
    stdClassMngs: StdClassMng[] = [];

    studentId = 0;

    constructor(
        public dialogRef: MatDialogRef<RegistredListStudentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService,
        private dialog: MatDialog,
        private botSheet: MatBottomSheet
    ) { }

    ngOnInit(): void {
        this.studentId = this.data.stdId;

        this.refreshData();
    }

    refreshData() {
        this.auth
            .post("/api/StdClassMng/getAllbyStd", this.studentId)
            .subscribe((data: jsondata) => {
                if (data.success) {
                    this.stdClassMngs = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
    }

    registerStudent() {
        const dialog = this.dialog.open(RegisterStudentModalComponent, {
            data: {
                stdId: this.data.stdId,
                stdName: this.data.stdName
            }
        });

        dialog.afterClosed().subscribe(data => {
            if (data) {
                this.refreshData();
            }
        });
    }

    deleteStdClassMng(row: StdClassMng) {
        if (row.canRemove) {
            if (
                window.confirm(
                    "حذف این مورد غیر قابل بازگشت است، آیا ادامه میدهید؟"
                )
            ) {
                this.auth
                    .post("/api/StdClassMng/Delete", row.id)
                    .subscribe((data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت حذف شد");
                            this.refreshData();
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    });
            }
        }
    }

    openChangeStateBotSheet(type, id, nowState) {
        const bottomSheet = this.botSheet.open(StdChangeStateSheetComponent, {
            data: {
                Id: id,
                nowState: nowState,
                type: type
            }
        });

        bottomSheet.afterDismissed().subscribe(data => {
            if (data) {
                this.refreshData();
            }
        });
    }

    getActiveStdClassMngId(): number {
        var stdClassMngId = 0;

        this.stdClassMngs.forEach(stdclassmng => {
            if (stdclassmng.isActive) {
                stdClassMngId = stdclassmng.id;
            }
        });

        return stdClassMngId;
    }

    setActiveStdClassMngId(id) {
        this.stdClassMngs.forEach(stdClassMng => {
            stdClassMng.isActive = false;
        });

        this.stdClassMngs[this.stdClassMngs.findIndex(c => c.id == id)].isActive = true;

        this.auth.post("/api/StdClassMng/setActiveStdClassMng", {
            studentId: this.studentId,
            stdClassMngId: id
        }, {
            type: 'Add',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Set Active StdClassMng(Registred List Modal)',
            logSource: 'dashboard',
            object: {
                studentId: this.studentId,
                stdClassMngId: id
            },
            table: "StdClassMng",
            tableObjectIds: [this.studentId]
        }).subscribe(data => {
            if (data.success) {

            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
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



    getStdStudyStateColorString(state) {
        return getStdStudyStateColorString(state);
    }
    getStdBehaveStateColorString(state) {
        return getStdBehaveStateColorString(state);
    }
    getStdPayrollStateColorString(state) {
        return getStdPayrollStateColorString(state);
    }
}

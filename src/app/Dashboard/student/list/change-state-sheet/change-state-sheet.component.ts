import { Component, OnInit, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IStudentType } from "../../StudentType/student-type";
import { getStdStudyStateString, getStdBehaveStateString, getStdPayrollStateString, getStdStudyStateColorString, getStdBehaveStateColorString, getStdPayrollStateColorString } from "../../stdClassMng";
import { getStudentStateString, getStudentStateColorString } from "../../student";

@Component({
    selector: "app-change-state-sheet",
    templateUrl: "./change-state-sheet.component.html",
    styleUrls: ["./change-state-sheet.component.scss"]
})
export class StdChangeStateSheetComponent implements OnInit {
    Id = 0;
    nowState = 0;

    Type = 0;

    // Only for type 4
    studentTypes: IStudentType[] = [];

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private auth: AuthService,
        private message: MessageService,
        private bottomSheetRef: MatBottomSheetRef<StdChangeStateSheetComponent>
    ) { }

    ngOnInit() {
        this.Id = this.data.Id;
        this.nowState = this.data.nowState ? this.data.nowState : null;
        this.Type = this.data.type;

        if (this.Type == 4) {
            this.auth.post("/api/StudentType/getAll", null).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.studentTypes = data.data;
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                },
                er => {
                    this.auth.handlerError(er);
                }
            );
        }
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


    getStdStudyStateColorString(state) {
        return getStdStudyStateColorString(state);
    }
    getStdBehaveStateColorString(state) {
        return getStdBehaveStateColorString(state);
    }
    getStdPayrollStateColorString(state) {
        return getStdPayrollStateColorString(state);
    }
    getStudentStateColorString(state) {
        return getStudentStateColorString(state);
    }

    changeState(newState) {
        var ids: number[] = [];
        ids.push(this.Id);

        if (this.Type == 0) {
            this.auth
                .post("/api/Student/setState", {
                    ids: ids,
                    state: newState
                }, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Change Student State',
                    logSource: 'dashboard',
                    object: {
                        StudentIds: ids,
                        state: newState
                    },
                    oldObject: {
                        StudentIds: ids,
                        OldState: this.nowState
                    },
                    table: "Student",
                    tableObjectIds: ids
                })
                .subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert();
                            this.bottomSheetRef.dismiss(true);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
        } else if (this.Type == 4) {
            this.auth.post("/api/StdClassMng/ChangeStudentType", {
                id: this.Id,
                stdType: newState
            }, {
                type: 'Edit',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Change Student Type',
                logSource: 'dashboard',
                object: {
                    id: this.Id,
                    stdType: newState
                },
                oldObject: {
                    id: this.Id,
                    OldStdType: this.nowState
                },
                table: "Student",
                tableObjectIds: [this.Id]
            }).subscribe(data => {
                if (data.success) {
                    this.message.showSuccessAlert();
                    this.bottomSheetRef.dismiss(true);
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        } else {
            this.auth
                .post("/api/StdClassMng/ChangeStateByType", {
                    id: this.Id,
                    type: this.Type,
                    state: newState
                }, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Change Student State By Type',
                    logSource: 'dashboard',
                    object: {
                        id: this.Id,
                        type: this.Type,
                        state: newState
                    },
                    oldObject: {
                        id: this.Id,
                        type: this.Type,
                        OldState: this.nowState
                    },
                    table: "Student",
                    tableObjectIds: [this.Id]
                })
                .subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert();
                            this.bottomSheetRef.dismiss(true);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
        }
    }
}

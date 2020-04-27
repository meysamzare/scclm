import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { NotificationShowType, INotificationAgent } from '../../notification';
import { IGrade } from 'src/app/Dashboard/grade/grade';
import { IClass } from 'src/app/Dashboard/class/class';

@Component({
    selector: 'app-send-notification-modal',
    templateUrl: './send-notification-modal.component.html',
    styleUrls: ['./send-notification-modal.component.scss']
})
export class SendNotificationModalComponent implements OnInit {

    notificationId = 0;
    showType: NotificationShowType;

    agents: INotificationAgent[] = [];

    selectedAgentsIds: number[] = [];

    search = "";

    grades: IGrade[] = [];
    selectedGrade: number = null;

    classesByGrade: IClass[] = [];
    selectedClass: number = null;

    constructor(
        public dialogRef: MatDialogRef<SendNotificationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.notificationId = this.data.id;
        this.showType = this.data.showType;

        this.refreshNotificationAgents();

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

    refreshNotificationAgents() {
        this.auth.post("/api/Notification/getNotificationAgents", {
            showType: this.showType,
            selectedGrade: this.selectedGrade,
            selectedClass: this.selectedClass
        }).subscribe(data => {
            if (data.success) {
                this.agents = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    onGradeSelected() {
        this.refreshNotificationAgents();

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

    clearGradeAndClass() {
        this.selectedClass = null;
        this.selectedGrade = null;

        this.refreshNotificationAgents();
    }

    onClassSelected() {
        this.refreshNotificationAgents();
    }

    clearAllSelected() {
        this.selectedAgentsIds = [];
    }

    selectAllInList() {
        this.agents.forEach(agent => {
            var agentId = agent.id;

            var selectedAgent = this.selectedAgentsIds.find(c => c == agentId);

            if (!selectedAgent) {
                this.selectedAgentsIds.push(agentId);
            }
        });
    }

    isAllSelected(): boolean {
        var selectedCount = this.selectedAgentsIds.length;
        var agentsCount = this.agents.length;

        if (agentsCount == 0) {
            return false;
        }

        return selectedCount === agentsCount;
    }

    masterToggle() {
        this.isAllSelected() ? this.clearAllSelected() : this.selectAllInList();
    }

    IsIdContainesSelectedAgents(agentId) {
        var selectedAgent = this.selectedAgentsIds.find(c => c == agentId);

        if (selectedAgent) {
            return true;
        }

        return false;
    }

    ToggleSelectedAgent(agentId: number) {

        var selectedAgent = this.selectedAgentsIds.find(c => c == agentId);

        if (selectedAgent) {
            this.selectedAgentsIds.splice(this.selectedAgentsIds.findIndex(c => c == agentId), 1);
        } else {
            this.selectedAgentsIds.push(agentId);
        }

    }

    getFiltredAgents() {
        if (this.search) {
            return this.sortAgentsBySelection(this.agents.filter(c => c.studentFullNameAndType.includes(this.search)));
        }

        return this.sortAgentsBySelection(this.agents);
    }

    sortAgentsBySelection(agents: INotificationAgent[]) {
        return agents.sort((a, b) => {
            var aSelected = this.selectedAgentsIds.includes(a.id);
            var bSelected = this.selectedAgentsIds.includes(b.id);

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
        if (this.selectedAgentsIds.length != 0) {
            this.auth.post("/api/Notification/Broadcast", {
                notificationId: this.notificationId,
                agentIds: this.selectedAgentsIds
            }, {
                type: 'Add',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'BroadcastNotification(SendToAgents)',
                logSource: 'dashboard',
                object: {
                    notificationId: this.notificationId,
                    agentIds: this.selectedAgentsIds
                },
                table: "Notification",
                tableObjectIds: this.selectedAgentsIds
            }).subscribe(data => {
                if (data.success) {
                    this.dialogRef.close(true);

                    this.auth.message.showSuccessAlert(data.message);
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

}
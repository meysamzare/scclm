import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { ITeacher } from 'src/app/Dashboard/teacher/teacher';
import { MatDialog } from '@angular/material';
import { TeacherChangePasswordModalComponent } from 'src/app/Dashboard/teacher/list/teacher-change-password-modal/teacher-change-password-modal.component';

@Injectable({
    providedIn: 'root'
})
export class TeacherRepositoryService {

    constructor(
        private auth: AuthService,
        private dialog: MatDialog
    ) { }

    
    async getAll() {
        let { success, data } = await this.auth.post("/api/Teacher/getAll").toPromise();

        if (success) {
            return data as ITeacher[];
        }

        return [];
    }

    async toggleAllCourseAccess(Id, haveAccess) {
        let obj = {
            id: Id,
            access: haveAccess
        }

       let { success } = await this.auth.post("/api/Teacher/ChangeAllCourseAccess", obj, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'change Teacher All Course Access',
            logSource: 'dashboard',
            object: obj,
            oldObject: null,
            table: "Teacher",
            tableObjectIds: [Id]
        }).toPromise();

        if (success) {
            this.auth.message.showSuccessAlert();
        }
    }

    
    openChangePasswordDialog(id, name) {
        const dialog = this.dialog.open(TeacherChangePasswordModalComponent, {
            data: {
                id: id,
                name: name
            }
        });

        return dialog;
    }
}

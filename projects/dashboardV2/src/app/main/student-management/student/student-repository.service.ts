import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class StudentRepositoryService {

    constructor(
        private auth: AuthService
    ) { }


    async toggleAccessByType(stdId: number, type: "Student" | "StudentParent", access: boolean) {

        let obj = {
            stdId: stdId,
            type: type,
            access: access,
        };

        let { success } = await this.auth.post("/api/Student/ChangeAccessByType", obj, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: `Change ${type} Mobile App Access`,
            logSource: 'dashboard',
            object: obj,
            oldObject: null,
            table: "Student",
            tableObjectIds: [stdId]
        }).toPromise();

        return success;
    }

    async getStudent(Id: number) {
        let { success, data } = await this.auth.post("/api/Student/getStudent", Id, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'get Student by Id',
            logSource: 'dashboard',
            object: Id,
            table: "Student",
            tableObjectIds: [Id]
        }).toPromise();

        if (success) {
            return {
                student: data.student,
                studentInfo: data.studentinfo || null
            }
        }
        
        return null;
    }
}

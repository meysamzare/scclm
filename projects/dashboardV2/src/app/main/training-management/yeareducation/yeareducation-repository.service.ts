import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IYeareducation } from 'src/app/Dashboard/yeareducation/yeareducation';

@Injectable({
    providedIn: 'root'
})
export class YeareducationRepositoryService {

    constructor(
        private auth: AuthService
    ) { }

    async setActiveYeareducation(id: number) {
        let { success } = await this.auth.post("/api/Yeareducation/setIsActive", id, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'set Active Yeareducation Id ',
            logSource: 'dashboard',
            object: {
                yeareducationId: id
            },
            oldObject: null
        }).toPromise();

        if (success) {
            this.auth.post("/api/Setting/setActiveYeareducationId", id).subscribe();

            return true;
        }

        return false;
    }

    async getAll() {
        let { success, data } = await this.auth.post("/api/Yeareducation/getAll").toPromise();

        if (success) {
            return data as IYeareducation[];
        }

        return [];
    }
}

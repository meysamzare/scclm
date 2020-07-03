import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { ITimeAndDays } from 'src/app/Dashboard/timeanddays/timeanddays';

@Injectable({
    providedIn: 'root'
})
export class DaysOfWeekRepositoryService {
    
    constructor(
        private auth: AuthService
    ) { }

    
    async getAll() {
        let { success, data } = await this.auth.post("/api/TimeAndDays/getAll").toPromise();

        if (success) {
            return data as ITimeAndDays[];
        }

        return [];
    }
}

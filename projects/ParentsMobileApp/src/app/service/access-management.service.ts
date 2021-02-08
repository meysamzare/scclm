import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { StudentAuthService } from './parent-student-auth.service';

@Injectable({
    providedIn: 'root'
})
export class AccessManagementService {

    accessMonitorCountdown: Subscription = null;

    constructor(
        public stdAuth: StudentAuthService
    ) { }

    public async checkForAccess() {
        try {
            const studentId = this.stdAuth.getStudent().id;

            const typeAccessResult = await this.stdAuth.auth.post("/api/Student/IsUserAccessByType", {
                stdId: studentId,
                type: 2
            }).toPromise();

            if (typeAccessResult.success) {
                if (!typeAccessResult.data) {
                    this.stdAuth.logout(true);
                    this.stdAuth.auth.message.showWarningAlert("دسترسی شما مسدود شده است!");
                    return;
                }
            }

            const financeAccessResult = await this.stdAuth.auth.post("/api/Student/IsUserAccessByFinance", studentId).toPromise();

            if (financeAccessResult.success) {
                const data: { haveAccess: boolean, message: string } = financeAccessResult.data;

                if (!data.haveAccess) {
                    this.stdAuth.logout(true);
                    this.stdAuth.auth.message.showWarningAlert(data.message);
                    return;
                }
            }
        } catch {

        }
    }

    startMonitor() {
        this.accessMonitorCountdown = interval(5 * 1000).subscribe(() => {
            this.checkForAccess();
        });
    }

    stopMonitor() {
        if (this.accessMonitorCountdown) {
            this.accessMonitorCountdown.unsubscribe();
        }
    }


}

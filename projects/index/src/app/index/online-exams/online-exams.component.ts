import { Component, OnInit } from '@angular/core';
import { ICategory } from 'src/app/Dashboard/category/category';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-online-exams',
    templateUrl: './online-exams.component.html',
    styleUrls: ['./online-exams.component.scss']
})
export class OnlineExamsComponent implements OnInit {

    onlineExams: ICategory[] | any[] = [];
    isLoading = true;

    constructor(
        public auth: AuthService
    ) { }

    ngOnInit() {
        this.refreshOnlineExams();
    }

    refreshOnlineExams() {
        this.isLoading = true;
        this.auth.post("/api/Category/getOnlineExams").pipe(
            finalize(() => this.isLoading = false)
        ).subscribe(data => {
            if (data.success) {
                this.onlineExams = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    
	getFileUrl(url): string {
		return this.auth.apiUrl + url.substr(1);
	}

}

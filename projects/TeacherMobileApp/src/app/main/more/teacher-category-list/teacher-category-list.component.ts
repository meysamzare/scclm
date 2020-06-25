import { Component, OnInit } from '@angular/core';
import { TeacherAuthService } from '../../../services/teacher-auth.service';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from 'src/app/Dashboard/category/category';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
    selector: 'app-teacher-category-list',
    templateUrl: './teacher-category-list.component.html',
    styleUrls: ['./teacher-category-list.component.scss']
})
export class TeacherCategoryListComponent implements OnInit {

    constructor(
        private tchAuth: TeacherAuthService,
        private activeRoute: ActivatedRoute,
    ) { }

    Type = 0;

    categories: ICategory[] = [];
    isLoading = false;

    Title = "";

    ngOnInit() {
        this.activeRoute.queryParams.subscribe(qparam => {
            let type = qparam["type"];

            this.Type = type || 0;

            if (this.Type < 0) {
                this.Type = 0;
            }

            if (this.Type > 1) {
                this.Type = 1;
            }

            this.Type == 0 ? this.Title = "نمون برگ ها" : this.Title = "آزمون های آنلاین";

            this.refreshCats();
        });
    }

    refreshCats() {

        this.isLoading = true;

        this.tchAuth.auth.post("/api/Category/getAllByTeacher", {
            type: this.Type,
            teacherId: this.tchAuth.getTeacherId()
        }).pipe(
            finalize(() => this.isLoading = false)
        ).subscribe(data => {
            if (data.success) {
                this.categories = data.data;
            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.tchAuth.auth.handlerError(er);
        });

    }

}

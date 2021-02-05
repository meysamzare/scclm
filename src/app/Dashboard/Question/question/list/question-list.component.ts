import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { merge } from "rxjs";
import { IQuestion } from "../question";


@Component({
    templateUrl: "./question-list.component.html",
    styles: [
        `
            .example-loading-shade {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 56px;
                right: 0;
                background: rgba(0, 0, 0, 0.15);
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `
    ]
})
export class QuestionDataListComponent {
    displayedColumns: string[] = [
        "select",
        "id",
        "name",
        "gradeName",
        "courseName",
        "person",
        "markString",
        "type",
        "action"
    ];
    dataSource: MatTableDataSource<IQuestion>;
    selection = new SelectionModel<IQuestion>(true, []);

    Questions: IQuestion[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;


    grades = [];
    courses = [];

    selectedGrade = null;
    selectedCourse = null;
    selectedDefct = null;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        public auth: AuthService,
        private message: MessageService
    ) {
        this.auth.post("/api/Grade/getAll").subscribe(data => {
            if (data.success) {
                this.grades = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/Course/getAll").subscribe(data => {
            if (data.success) {
                this.courses = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        });
    }


    getCourseByGrade() {
        const gradeId = this.selectedGrade;

        if (gradeId) {
            return this.courses.filter(c => c.gradeId == gradeId);
        }

        return [];
    }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            // if (!row.havePerson) {
            rowCanSelect += 1;
            // }
        });

        return rowCanSelect;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;

        return numSelected === this.getRowCanSelected();
    }

    getCurrentDataOfPage(): IQuestion[] {
        let List: IQuestion[];

        this.dataSource.connect().subscribe(rows => (List = rows));

        return List;
    }

    public resetSelection(event?: PageEvent) {
        this.selection.clear();
    }

    haveAnyData(): boolean {
        return this.dataSource ? true : false;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.getCurrentDataOfPage().forEach(row => {
                //   if (!row.havePerson) {
                this.selection.select(row);
                //   }
            });
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_Question")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/Question/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Question',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: "Question",
                    tableObjectIds: ids
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert(
                                "موارد انتخابی با موفقیت حذف شد"
                            );
                            this.refreshDataSource();
                            this.selection.clear();
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

    onEdit(id) {
        if (this.auth.isUserAccess("edit_Question")) {
            this.router.navigate(["/dashboard/question/edit/" + id]);
        }
    }

    refreshDataSource() {
        this.selection.clear();

        const obj = {
            getparams: {
                sort: this.sort.active,
                direction: this.sort.direction,
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            },
            selectedGrade: this.selectedGrade,
            selectedCourse: this.selectedCourse,
            selectedDefct: this.selectedDefct
        };

        this.auth.post("/api/Question/Get", obj, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Question',
            logSource: 'dashboard',
            object: obj,
            table: "Question"
        }).subscribe(data => {
            if (data.success) {
                this.isLoadingResults = false;
                this.itemLength = data.type;
                this.Questions = data.data;

                this.dataSource = new MatTableDataSource(this.Questions);
            } else {
                this.isLoadingResults = false;
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    ngOnInit() {
        const changeed = merge(this.sort.sortChange, this.paginator.page);

        changeed.subscribe(() => {
            this.refreshDataSource();
        });
    }

    ngAfterViewInit(): void {
        this.refreshDataSource();
    }

    applyFilter(filterValue: string) {
        this.refreshDataSource();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
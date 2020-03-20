import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { merge } from "rxjs";
import { ICourse } from "../course";
import { IGrade } from "../../grade/grade";
import { IClass } from "../../class/class";
import { ITeacher } from "../../teacher/teacher";



@Component({
    templateUrl: "./course-list.component.html",
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
export class CourseListComponent {
    displayedColumns: string[] = [
        "select",
        "id",
        "name",
        "courseMix",
        "teachTime",
        "gradeName",
        "teacherName",
        "action"
    ];
    dataSource: MatTableDataSource<ICourse>;
    selection = new SelectionModel<ICourse>(true, []);

    Courses: ICourse[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;


    grades: IGrade[] = [];
    selectedGrade: number = null;

    teachers: ITeacher[] = [];
    selectedTeacher: number = null;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService
    ) {
        this.auth.post("/api/Grade/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.grades = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/Teacher/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.teachers = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            if (!row.haveTimeSchedules && !row.haveExam) {
                rowCanSelect += 1;
            }
        });

        return rowCanSelect;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;

        return numSelected === this.getRowCanSelected();
    }

    getCurrentDataOfPage(): ICourse[] {
        let List: ICourse[];

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
                if (!row.haveTimeSchedules && !row.haveExam) {
                    this.selection.select(row);
                }
            });
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_Course")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/Course/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Course',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
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
        if (this.auth.isUserAccess("edit_Course")) {
            this.router.navigate(["/dashboard/course/edit/" + id]);
        }
    }

    refreshDataSource() {
        this.selection.clear();

        var obj = {
            getparams: {
                sort: this.sort.active,
                direction: this.sort.direction,
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            },
            selectedGrade: this.selectedGrade,
            selectedTeacher: this.selectedTeacher
        }

        this.auth
            .post("/api/Course/Get", obj, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Course List',
                logSource: 'dashboard',
                object: obj,
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;
                        this.Courses = data.data;

                        this.dataSource = new MatTableDataSource(this.Courses);
                    } else {
                        this.isLoadingResults = false;
                        this.message.showMessageforFalseResult(data);
                    }
                },
                er => {
                    this.auth.handlerError(er);
                }
            );
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
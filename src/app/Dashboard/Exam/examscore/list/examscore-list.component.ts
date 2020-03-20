import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { merge } from "rxjs";
import { IExamScore } from "../examscore";
import { ScoreSelectGroupModalComponent } from "../modals/score-select-group/score-select-group.component";
import { IExam } from "../../exam/exam";
import { ICourse } from "src/app/Dashboard/course/course";
import { ExamDetailsComponent } from "src/app/Dashboard/home/exam-details/exam-details.component";

@Component({
    templateUrl: "./examscore-list.component.html",
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
export class ExamScoreListComponent {
    displayedColumns: string[] = [
        "select",
        "id",
        "studentName",
        "examName",
        "scoreString",
        "topScore",
        "examDate",
        "action"
    ];
    dataSource: MatTableDataSource<IExamScore>;
    selection = new SelectionModel<IExamScore>(true, []);

    ExamScores: IExamScore[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    exams: IExam[] = [];
    selectedExamId: number = null;

    courses: ICourse[] = [];
    selectedCourseId: number = null;

    selectedNameString = "";

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService,
        private dialog: MatDialog
    ) { }

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

    getCurrentDataOfPage(): IExamScore[] {
        let List: IExamScore[];

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
        if (this.auth.isUserAccess("remove_ExamScore")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/ExamScore/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'ExamScore',
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
        if (this.auth.isUserAccess("edit_ExamScore")) {
            this.router.navigate(["/dashboard/examscore/edit/" + id]);
        }
    }

    setSelectedName(name) {
        this.selectedNameString = name;
        this.refreshDataSource();
    }

    setSelectedExamId(examId) {
        if (examId) {
            this.selectedExamId = examId;
            this.refreshDataSource();
        }
    }

    setSelectedCourseId() {
        if (this.selectedCourseId) {
            this.refreshDataSource();
        }
    }

    refreshDataSource() {
        this.selection.clear();

        this.auth
            .post("/api/ExamScore/Get", {
                getparam: {
                    sort: this.sort.active,
                    direction: this.sort.direction,
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    q: this.txtSearch
                },
                examId: this.selectedExamId,
                courseId: this.selectedCourseId,
                name: this.selectedNameString
            }, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'ExamScore List',
                logSource: 'dashboard',
                object: {
                    getparam: {
                        sort: this.sort.active,
                        direction: this.sort.direction,
                        pageIndex: this.paginator.pageIndex,
                        pageSize: this.paginator.pageSize,
                        q: this.txtSearch
                    },
                    examId: this.selectedExamId,
                    courseId: this.selectedCourseId,
                    name: this.selectedNameString
                },
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;
                        this.ExamScores = data.data;

                        this.dataSource = new MatTableDataSource(this.ExamScores);
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

        this.auth.post("/api/Exam/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.exams = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );

        this.auth.post("/api/Course/getAll").subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.courses = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
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

    clearSearch() {
        this.selectedExamId = null;
        this.selectedNameString = "";
        this.selectedCourseId = null;

        this.refreshDataSource();
    }

    showExamDetail(examId) {
        const dialog = this.dialog.open(ExamDetailsComponent, {
            data: {
                examId: examId
            }
        });
    }

    setScoreGroup() {
        const dialog = this.dialog.open(ScoreSelectGroupModalComponent);

        dialog.afterClosed().subscribe(data => {
            this.refreshDataSource();
        });
    }
}

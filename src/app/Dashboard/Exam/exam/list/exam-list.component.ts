import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { merge } from "rxjs";
import { IExam } from "../exam";
import { IGrade } from "src/app/Dashboard/grade/grade";
import { IClass } from "src/app/Dashboard/class/class";
import { ITeacher } from "src/app/Dashboard/teacher/teacher";
import { ExamDetailsComponent } from "src/app/Dashboard/home/exam-details/exam-details.component";
import { SetScoreGroupModalComponent } from "../../examscore/modals/set-score-group/set-score-group.component";
import { IWorkbook } from "src/app/Dashboard/workbook/workbook";
import { IExamType } from "../../examtype/examtype";

declare var $: any;

@Component({
    templateUrl: "./exam-list.component.html",
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
export class ExamListComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        "select",
        "id",
        "result",
        "name",
        "courseName",
        "date",
        "examTypeName",
        "className",
        "action"
    ];
    dataSource: MatTableDataSource<IExam>;
    selection = new SelectionModel<IExam>(true, []);

    Exams: IExam[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    grades: IGrade[] = [];
    selectedGrade: number = null;

    classes: IClass[] = [];
    selectedClass: number = null;

    teachers: ITeacher[] = [];
    selectedTeacher: number = null;

    workbooks: IWorkbook[] = [];
    selectedWorkbook: number = null;

    examTypes: IExamType[] = [];
    selectedExamType: number = null;

    filtredType: "all" | "passed" | "upcomming" | "waitingForResult" | "cancelled" = "all";

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService,
        private dialog: MatDialog
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
        this.auth.post("/api/Class/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.classes = data.data;
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
        this.auth.post("/api/Workbook/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.workbooks = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/ExamType/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.examTypes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }


    getFiltredClass() {
        var gradeId = this.selectedGrade;
        if (gradeId) {
            return this.classes.filter(c => c.gradeId == gradeId)
        }

        return this.classes;
    }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            if (!row.haveChildren) {
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

    getCurrentDataOfPage(): IExam[] {
        let List: IExam[];

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
                if (!row.haveChildren) {
                    this.selection.select(row);
                }
            });
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_Exam")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/Exam/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Delete Exam(s)',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: "Exam",
                    tableObjectIds: ids
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert(
                                "موارد انتخابی با موفقیت حذف شد"
                            );
                            this.refreshDataSource();

                            $("#divtree").jstree("refresh");
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

    deleteRow(id) {
        if (this.auth.isUserAccess("remove_Exam")) {
            let ids: number[] = [];
            ids.push(id);

            var deleteDatas = [this.Exams.find(c => c.id == id)];

            this.auth.post("/api/Exam/Delete", ids, {
                type: 'Delete',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Delete Exam',
                logSource: 'dashboard',
                deleteObjects: deleteDatas,
                table: "Exam",
                tableObjectIds: ids
            }).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.message.showSuccessAlert(
                            " با موفقیت حذف شد"
                        );
                        this.refreshDataSource();

                        $("#divtree").jstree("refresh");
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

    onEdit(id) {
        if (this.auth.isUserAccess("edit_Exam")) {
            this.router.navigate(["/dashboard/exam/edit/" + id]);
        }
    }

    refreshDataSource() {
        this.selection.clear();

        var obj = {
            getparam: {
                sort: this.sort.active,
                direction: this.sort.direction,
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            },
            selectedGrade: this.selectedGrade,
            selectedClass: this.selectedClass,
            selectedTeacher: this.selectedTeacher,
            selectedWorkbook: this.selectedWorkbook,
            selectedExamType: this.selectedExamType,
            type: this.filtredType
        };

        this.auth
            .post("/api/Exam/Get", obj, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Get Exam List',
                logSource: 'dashboard',
                object: obj,
                table: "Exam"
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;
                        this.Exams = data.data;

                        this.dataSource = new MatTableDataSource(this.Exams);
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
        var sanitizerUr = url => {
            return this.auth.serializeUrl(url);
        };

        $("#divtree").jstree({
            plugins: ["wholerow", "types"],
            core: {
                data: {
                    url: function (node) {
                        return node.id === "#"
                            ? sanitizerUr("/api/Exam/GetTreeRoot")
                            : sanitizerUr(
                                "/api/Exam/GetTreeChildren/" + node.id
                            );
                    },
                    data: function (node) {
                        return { id: node.id };
                    }
                },
                strings: {
                    "Loading ...": "لطفا اندکی صبر نمایید"
                },
                multiple: false
            },
            types: {
                default: {
                    icon: "fa fa-folder"
                }
            }
        });



        $("#divtree").on("changed.jstree", (e, data) => {
            if (data.node) {
                this.txtSearch = data.node.text;
                this.refreshDataSource();
            }
        });

        this.refreshDataSource();
    }

    clearSelection() {
        $("#divtree").jstree("deselect_all");
        this.txtSearch = "";
        this.refreshDataSource();
    }

    openAllTree() {
        $("#divtree").jstree("open_all");
    }

    closeAllTree() {
        var a = $("#divtree").jstree("close_all");
    }


    checkForNodeOpen(): boolean {
        if ($("#divtree li.jstree-open").length) {
            return true;
        } else {
            return false;
        }
    }


    applyFilter(filterValue: string) {
        this.refreshDataSource();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


    showExamDetail(examId) {
        const dialog = this.dialog.open(ExamDetailsComponent, {
            data: {
                examId: examId
            }
        });
    }


    openSetScoreGroupModal(examId) {
        const dialog = this.dialog.open(SetScoreGroupModalComponent, {
            data: {
                examId: examId
            }
        });

        dialog.afterClosed().subscribe(data => {

        });
    }

}

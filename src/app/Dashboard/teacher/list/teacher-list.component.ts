import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { merge } from "rxjs";
import { ITeacher } from "../teacher";
import { TeacherChangePasswordModalComponent } from "./teacher-change-password-modal/teacher-change-password-modal.component";


@Component({
    templateUrl: "./teacher-list.component.html",
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
export class TeacherListComponent {
    displayedColumns: string[] = [
        "select",
        "id",
        "name",
        "code",
        "getPersonelCode",
        "action"
    ];
    dataSource: MatTableDataSource<ITeacher>;
    selection = new SelectionModel<ITeacher>(true, []);

    Teachers: ITeacher[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    access: "all" | "allcourse" | "owncourse" = "all";

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        public auth: AuthService,
        private message: MessageService,
        private dialog: MatDialog
    ) { }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            if (!row.haveTimeSchedules && !row.haveCourses) {
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

    getCurrentDataOfPage(): ITeacher[] {
        let List: ITeacher[];

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
                if (!row.haveTimeSchedules && !row.haveCourses) {
                    this.selection.select(row);
                }
            });
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_Teacher")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/Teacher/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Teacher',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: "Teacher",
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
        if (this.auth.isUserAccess("edit_Teacher")) {
            this.router.navigate(["/dashboard/teacher/edit/" + id]);
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
            access: this.access
        }

        this.auth
            .post("/api/Teacher/Get", obj, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Teacher',
                logSource: 'dashboard',
                object: obj,
                table: "Teacher"
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;
                        this.Teachers = data.data;

                        this.dataSource = new MatTableDataSource(this.Teachers);
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

    openChangePasswordDialog(id, name) {
        const dialog = this.dialog.open(TeacherChangePasswordModalComponent, {
            data: {
                id: id,
                name: name
            }
        });
    }

    toggleTeacherAllCourseAccess(id, event) {
        var access: boolean = event.checked;

        this.auth.post("/api/Teacher/ChangeAllCourseAccess", {
            id: id,
            access: access
        }, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'change Teacher All Course Access',
            logSource: 'dashboard',
            object: {
                id: id,
                access: access
            },
            oldObject: null,
            table: "Teacher",
            tableObjectIds: [id]
        }).subscribe(data => {
            if (data.success) {
                this.message.showSuccessAlert();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }
}
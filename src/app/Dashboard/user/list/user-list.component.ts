import { Component, ViewChild, Inject, OnDestroy, OnInit, AfterViewInit } from "@angular/core";
import {
    MatTableDataSource,
    MatSort,
    MatPaginator,
    MatBottomSheetRef,
    MatBottomSheet,
    MAT_BOTTOM_SHEET_DATA,
    PageEvent
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { IUser } from "../user";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { merge } from "rxjs";

@Component({
    templateUrl: "./user-list.component.html",
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
export class UserListComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        "select",
        "id",
        "fullName",
        "meliCode",
        "username",
        "roleName",
        "state",
        "action"
    ];
    dataSource: MatTableDataSource<IUser>;
    selection = new SelectionModel<IUser>(true, []);

    Users: IUser[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService,
        private bottomSheet: MatBottomSheet
    ) { }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === this.getRowCanSelected();
    }

    haveAnyData(): boolean {
        return this.dataSource ? true : false;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.getCurrentDataOfPage().forEach(row =>
                this.selection.select(row)
            );
    }

    getCurrentDataOfPage(): IUser[] {
        let List: IUser[];

        this.dataSource.connect().subscribe(rows => (List = rows));

        return List;
    }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            rowCanSelect += 1;
        });

        return rowCanSelect;
    }

    public resetSelection(event?: PageEvent) {
        this.selection.clear();
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_User")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/user/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'User (Change State To Deleted)',
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
        if (this.auth.isUserAccess("edit_User")) {
            this.router.navigate(["/dashboard/user/edit/" + id]);
        }
    }

    changeUserState(id, state) {
        if (this.auth.isUserAccess("validation_User")) {
            this.bottomSheet.open(BottomSheetChangeState, {
                data: { userId: id, userState: state }
            });

            this.bottomSheet._openedBottomSheetRef
                .afterDismissed()
                .subscribe(data => {
                    if (data) {
                        if (data.changed) {
                            this.refreshDataSource();
                        }
                    }
                });
        }
    }

    refreshDataSource() {

        this.selection.clear();

        this.auth
            .post("/api/User/Get", {
                sort: this.sort.active,
                direction: this.sort.direction,
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            }, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'User',
                logSource: 'dashboard',
                object: {
                    sort: this.sort.active,
                    direction: this.sort.direction,
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    q: this.txtSearch
                },
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;
                        this.Users = data.data;

                        this.dataSource = new MatTableDataSource(this.Users);
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

@Component({
    selector: "bottom-sheet-change-state",
    templateUrl: "./bottom-sheet-change-state.html"
})
export class BottomSheetChangeState implements OnDestroy {
    userId;
    userState;
    changed: Boolean = false;

    constructor(
        private bottomSheetRef: MatBottomSheetRef<BottomSheetChangeState>,
        private auth: AuthService,
        private message: MessageService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
    ) {
        this.userId = data.userId;
        this.userState = data.userState;
    }

    changeState(state): void {
        this.auth
            .post("/api/User/changeState", {
                userId: this.userId,
                userState: state
            }, {
                type: 'Edit',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Change User State (Change State Bottom Sheet)',
                logSource: 'dashboard',
                object: {
                    userId: this.userId,
                    NewUserState: state
                },
                oldObject: {
                    userId: this.userId,
                    OldUserState: this.userState
                }
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.message.showMessageForSuccessResult(data);
                        this.changed = true;
                        this.bottomSheetRef.dismiss({ changed: true });
                    } else {
                        this.message.showMessageforFalseResult(data);
                        this.bottomSheetRef.dismiss({ changed: false });
                    }
                },
                er => {
                    this.auth.handlerError(er);
                    this.bottomSheetRef.dismiss({ changed: false });
                }
            );
    }

    ngOnDestroy(): void { }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge } from 'rxjs';
import { INotification, getNotificationTypeString } from '../notification';
import { SendNotificationModalComponent } from './send-notification-modal/send-notification-modal.component';
import { NotificationSeenModalComponent } from './notification-seen-modal/notification-seen-modal.component';

@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
    displayedColumns: string[] = [
        "select",
        "id",
        "dateCreate",
        "title",
        "shortContent",
        "type",
        "date",
        "action"
    ];
    dataSource: MatTableDataSource<INotification>;
    selection = new SelectionModel<INotification>(true, []);

    PAGE_Datas: INotification[] = [];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;


    PAGE_TITLE = "اعلامیه";
    PAGE_TITLES = "اعلانات";
    PAGE_APIURL = "Notification";
    PAGE_URL = "notification";
    PAGE_ROLE = "Notification";


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    showDetail = false;
    detailTitle = "";
    detailContent = "";

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
            // if (!row.haveStudent) {
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

    getCurrentDataOfPage(): INotification[] {
        let List: INotification[];

        this.dataSource.connect().subscribe(rows => (List = rows));

        return List;
    }

    public resetSelection(event?: PageEvent) {
        this.selection.clear();
    }

    haveAnyData(): boolean {
        return this.PAGE_Datas.length != 0 ? true : false;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.getCurrentDataOfPage().forEach(row => {
                // if (!row.haveStudent) {
                this.selection.select(row);
                // }
            });
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_" + this.PAGE_ROLE)) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/" + this.PAGE_APIURL + "/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Notification',
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
        if (this.auth.isUserAccess("edit_" + this.PAGE_ROLE)) {
            this.router.navigate(["/dashboard/" + this.PAGE_URL + "/edit/" + id]);
        }
    }

    getBrodcastButtonDisableState(type) {
        if (type == 0 || type == 1 || type == 2) {
            return false;
        }

        return true;
    }

    refreshDataSource() {
        this.selection.clear();

        this.auth
            .post("/api/" + this.PAGE_APIURL + "/Get", {
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
                tableName: 'Notification List',
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
                        this.PAGE_Datas = data.data;

                        this.dataSource = new MatTableDataSource(this.PAGE_Datas);
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

    getNotificationTypeString(type) {
        return getNotificationTypeString(type);
    }

    showSendNotificationModal(id, showType) {
        const dialog = this.dialog.open(SendNotificationModalComponent, {
            data: {
                id: id,
                showType: showType
            }
        });

        dialog.afterClosed().subscribe(data => {
            if (data) {
                this.refreshDataSource();
            }
        });
    }

    showNotificationSeenModal(id, title) {
        const dialog = this.dialog.open(NotificationSeenModalComponent, {
            data: {
                id: id,
                title: title
            }
        });
    }

    showDetailBottom(title, content) {
        this.showDetail = true;

        this.detailTitle = title;
        this.detailContent = content;
    }

    closeDetailBottom() {
        this.showDetail = false;

        this.detailTitle = "";
        this.detailContent = "";
    }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge } from 'rxjs';
import { ViewLogDescComponent } from '../view-log-desc/view-log-desc.component';

export class ILog {
    id: number;
    event: string;
    desc: string;
    ip: string;
    dateString: string;
    agentId: string;
    agnetType: string;
    agentName: string;
    logSource: string;
}

@Component({
    selector: 'app-log-list',
    templateUrl: './log-list.component.html',
    styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit {
    displayedColumns: string[] = [
        "event",
        "logSource",
        "agentType",
        "agent",
        "ip",
        "date",
        "desc",
    ];
    dataSource: MatTableDataSource<ILog>;
    selection = new SelectionModel<ILog>(true, []);

    PAGE_Datas: ILog[] = [];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;


    PAGE_TITLE = "لاگ های سیستم";
    PAGE_TITLES = "لاگ های سیستم";
    PAGE_APIURL = "Log";
    PAGE_URL = "Log";
    PAGE_ROLE = "Log";

    selectedEvent: string = null;
    selectedLogSource: string = null;
    selectedAgentType: string = null;


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
            if (false) {
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

    getCurrentDataOfPage(): ILog[] {
        let List: ILog[];

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
                if (false) {
                    this.selection.select(row);
                }
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
                    tableName: this.PAGE_APIURL,
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
            selectedEvent: this.selectedEvent,
            selectedLogSource: this.selectedLogSource,
            selectedAgentType: this.selectedAgentType,
        }

        this.auth
            .post("/api/" + this.PAGE_APIURL + "/Get", obj, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: this.PAGE_APIURL + ' List Get Method',
                logSource: 'dashboard',
                object: obj,
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

    viewLogDesc(id) {
        const dialog = this.dialog.open(ViewLogDescComponent, {
            data: {
                id: id
            }
        });
    }

}

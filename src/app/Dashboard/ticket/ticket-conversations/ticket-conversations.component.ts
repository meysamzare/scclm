import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TicketRepositoryService } from '../ticket-repository.service';
import { ITicket, TicketType, getTicketOrderString, getTicketStateString, getTicketTypeString, getTicketOrderColor } from '../ticket';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { merge } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
    selector: 'app-ticket-conversations',
    templateUrl: './ticket-conversations.component.html',
    styleUrls: ['./ticket-conversations.component.scss']
})
export class TicketConversationsComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        "select",
        "id",
        "subject",
        "order",
        "state",
        "sender",
        "reciver",
        "action"
    ];
    dataSource: MatTableDataSource<ITicket>;
    selection = new SelectionModel<ITicket>(true, []);

    PAGE_Datas: ITicket[] = [];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;


    PAGE_TITLE = "مکاتبه";
    PAGE_TITLES = "مکاتبات";
    PAGE_APIURL = "Ticket";
    PAGE_URL = "ticket/conversations";

    onlyShowUnreads = false;

    Type: "inbox" | "sendbox" | "import" | "draft" = "inbox";

    inboxCount = 0;
    sendboxCount = 0;
    draftCount = 0;
    importCount = 0;


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private ticketRep: TicketRepositoryService,
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService
    ) { }

    ngOnInit() {
        const changeed = merge(this.sort.sortChange, this.paginator.page);

        changeed.subscribe(() => {
            this.refreshDataSource();
        });
    }

    getTicketOrderString(order) {
        return getTicketOrderString(order);
    }

    getTicketOrderColor(order) {
        return getTicketOrderColor(order);
    }

    getTicketStateString(state) {
        return getTicketStateString(state);
    }

    getTicketTypeString(type) {
        return getTicketTypeString(type);
    }

    setType(type) {
        this.Type = type;

        this.paginator.firstPage();

        this.refreshDataSource();
    }

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

    getCurrentDataOfPage(): ITicket[] {
        let List: ITicket[];

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

    closeSelected() {
        // if (this.auth.isUserAccess("remove_" + this.PAGE_ROLE)) {
        if (this.selection.selected.length != 0) {
            let ids: number[] = [];
            this.selection.selected.forEach(row => ids.push(row.id));

            var deleteDatas = this.selection.selected;

            this.auth.post("/api/" + this.PAGE_APIURL + "/closeTickets", ids, {
                type: 'Edit',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Close Tickets',
                logSource: 'dashboard',
                oldObject: deleteDatas,
                object: null,
                table: this.PAGE_APIURL,
                tableObjectIds: ids
            }).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.message.showSuccessAlert(
                            "تیکت های انتخابی با موفقیت بسته شدند"
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
            // }
        }
    }

    deleteSelected() {
        // if (this.auth.isUserAccess("remove_" + this.PAGE_ROLE)) {
        if (this.selection.selected.length != 0) {
            let ids: number[] = [];
            this.selection.selected.forEach(row => ids.push(row.id));

            var deleteDatas = this.selection.selected;

            this.auth.post("/api/" + this.PAGE_APIURL + "/removeTickets", ids, {
                type: 'Edit',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Remove Tickets',
                logSource: 'dashboard',
                oldObject: deleteDatas,
                object: null,
                table: this.PAGE_APIURL,
                tableObjectIds: ids
            }).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.message.showSuccessAlert(
                            "تیکت های انتخابی با موفقیت حذف شدند"
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
            // }
        }
    }

    // onEdit(id) {
    //     if (this.auth.isUserAccess("edit_" + this.PAGE_ROLE)) {
    //         this.router.navigate(["/dashboard/" + this.PAGE_URL + "/edit/" + id]);
    //     }
    // }

    refreshDataSource() {
        this.selection.clear();

        var obj = {
            getParam: {
                sort: this.sort.active,
                direction: this.sort.direction,
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            },
            id: this.auth.getUserId(),
            type: TicketType.User,
            onlyUnreads: this.onlyShowUnreads,
            showType: this.Type
        };

        this.auth
            .post("/api/" + this.PAGE_APIURL + "/Get", obj, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Ticket Get Method',
                logSource: 'dashboard',
                object: obj,
                table: this.PAGE_APIURL
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;

                        this.PAGE_Datas = data.data.data;

                        this.inboxCount = data.data.inboxCount;
                        this.sendboxCount = data.data.sendboxCount;
                        this.draftCount = data.data.draftCount;
                        this.importCount = data.data.importCount;

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

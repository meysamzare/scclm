import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge } from 'rxjs';
import { CommentLocationComponent } from './comment-location/comment-location.component';
import { CommentTotalType } from '../product-comment';

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.scss'],
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
export class CommentListComponent implements OnInit {

    displayedColumns: string[] = [
        "select",
        "id",
        "fullName",
        "postTitle",
        "content",
        "haveComformed",
        "email",
        "date",
        "action"
    ];

    dataSource: MatTableDataSource<any>;
    selection = new SelectionModel<any>(true, []);

    Comments: any[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    totalType: CommentTotalType = CommentTotalType.post;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService,
        public dialog: MatDialog
    ) {
        this.activeroute.data.subscribe(data => {
            this.totalType = data["type"];
        });
    }

    getProductTitle() {
        switch (this.totalType) {
            case CommentTotalType.post:
                return "پست";
            case CommentTotalType.product:
                return "کتاب و جزوات";
            case CommentTotalType.virtualTeaching:
                return "آموزش مجازی آفلاین";
        }
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

    getCurrentDataOfPage(): any[] {
        let List: any[];

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
        if (this.auth.isUserAccess("remove_Comment")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/Comment/Delete", {
                    ids: ids,
                    totalType: this.totalType
                }, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Post Comment',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: "Comment",
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
        if (this.auth.isUserAccess("edit_Comment")) {
            this.router.navigate(["/dashboard/comment/edit/" + id]);
        }
    }

    refreshDataSource() {
        this.selection.clear();

        let obj = {
            getparams: {
                sort: this.sort.active,
                direction: this.sort.direction,
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            },
            totalType: this.totalType
        };

        this.auth.post(`/api/Comment/${this.totalType == 0 ? 'Get' : 'Get_Product'}`, obj, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Post Comment',
            logSource: 'dashboard',
            object: obj,
            table: "Comment"
        }).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.isLoadingResults = false;
                    this.itemLength = data.type;
                    this.Comments = data.data;

                    this.dataSource = new MatTableDataSource(this.Comments);
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

    setComformState(id, comformed) {
        this.auth.post("/api/Comment/setComformState", {
            id: id,
            comformed: comformed,
            totalType: this.totalType
        }, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Set Comformed Comment',
            logSource: 'dashboard',
            object: {
                id: id,
                comformed: comformed,
                totalType: this.totalType
            },
            table: "Comment",
            tableObjectIds: [id]
        }).subscribe((data: jsondata) => {
            if (data.success) {
                this.message.showSuccessAlert();
                this.refreshDataSource();
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    showCommentLocation(id) {
        this.dialog.open(CommentLocationComponent, {
            data: {
                id: id,
                totalType: this.totalType
            }
        });
    }

}

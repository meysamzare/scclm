import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge } from 'rxjs';
import { IPost, getPostTypeString, getPostColor, getPostTypeRoleString } from '../post';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss'],
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
export class PostListComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        "select",
        "id",
        "name",
        // "title",
        "author",
        "date",
        "state",
        "type",
        "action"
    ];
    dataSource: MatTableDataSource<IPost>;
    selection = new SelectionModel<IPost>(true, []);

    Posts: IPost[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    selectedPostType: number = null;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        public auth: AuthService,
        private message: MessageService
    ) { }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            if (!row.haveSchedules) {
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

    getCurrentDataOfPage(): IPost[] {
        let List: IPost[];

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
                if (!row.haveSchedules) {
                    this.selection.select(row);
                }
            });
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_Post")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/Post/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Post',
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

    getPostTypeString(type) {
        return getPostTypeString(type);
    }

    getPostTypeColor(type) {
        return getPostColor(type);
    }

    getPostTypeRoleString(type) {
        return getPostTypeRoleString(type);
    }

    onEdit(id) {
        if (this.auth.isUserAccess("edit_Post")) {
            this.router.navigate(["/dashboard/post/edit/" + id]);
        }
    }

    refreshDataSource() {
        this.selection.clear();

        var paramObj = {
            getParams: {
                sort: this.sort.active,
                direction: this.sort.direction,
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            },
            postType: this.selectedPostType
        };

        this.auth
            .post("/api/Post/Get", paramObj, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Post List',
                logSource: 'dashboard',
                object: paramObj,
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;
                        this.Posts = data.data;

                        this.dataSource = new MatTableDataSource(this.Posts);
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

    changeActiveState(postId, active) {
        this.auth.post("/api/Post/changeActiveState", {
            postId: postId,
            active: active
        }).subscribe(data => {
            if (data.success) {
                this.refreshDataSource();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

}

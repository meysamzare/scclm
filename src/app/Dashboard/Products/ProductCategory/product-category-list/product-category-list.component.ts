import { Component, OnInit, ViewChild } from '@angular/core';
import { IProductCategory } from '../product-category';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge } from 'rxjs';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent implements OnInit {
    displayedColumns: string[] = [
        "select",
        "id",
        "title",
        "action"
    ];
    dataSource: MatTableDataSource<IProductCategory>;
    selection = new SelectionModel<IProductCategory>(true, []);

    PAGE_Datas: IProductCategory[] = [];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;


    PAGE_TITLE = " دسته بندی محصول ";
    PAGE_TITLES = " دسته بندی محصولات ";
    PAGE_APIURL = "ProductCategory";
    PAGE_URL = "product-category";
    PAGE_ROLE = "ProductCategory";


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService
    ) { }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            if (!row.haveAnyProduct) {
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

    getCurrentDataOfPage(): IProductCategory[] {
        let List: IProductCategory[];

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
                if (!row.haveAnyProduct) {
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
            sort: this.sort.active,
            direction: this.sort.direction,
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            q: this.txtSearch
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

}

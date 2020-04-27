import { Component, ViewChild, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit, ElementRef } from "@angular/core";
import {
    MatTableDataSource,
    MatPaginator,
    MatSort,
    PageEvent
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { ICategory } from "../category";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { merge } from "rxjs";

declare var $: any;

@Component({
    templateUrl: "./category-list.component.html",
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
export class CategoryListComponent implements OnInit, AfterViewInit, AfterContentInit {
    displayedColumns: string[] = [
        "select",
        "id",
        "title",
        "parentTitle",
        "pin",
        "action"
    ];
    dataSource: MatTableDataSource<ICategory>;
    selection = new SelectionModel<ICategory>(true, []);

    Category: ICategory[];

    isLoading: boolean;

    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild("tree", { static: true }) tree: ElementRef;

    Categories: ICategory[] = [];

    selectedCatId = null;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService
    ) {
        this.auth.post("/api/Category/GetAll").subscribe((data: jsondata) => {
            if (data.success) {
                this.Categories = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        });
    }

    togglePin(id) {
        this.auth.post("/api/Category/togglePin", id).subscribe(data => {
            if (data.success) {
                this.refreshDataSource();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    onCategorySelectChange() {
        if (this.selectedCatId) {
            let cat = this.Categories.find(c => c.id == this.selectedCatId);
            this.txtSearch = cat.title;
            this.refreshDataSource();
        } else {
            this.txtSearch = "";
            this.refreshDataSource();
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

    getCurrentDataOfPage(): ICategory[] {
        let List: ICategory[];

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
        if (this.auth.isUserAccess("remove_Category")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/Category/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Category',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: "Category",
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
        if (this.auth.isUserAccess("edit_Category")) {
            this.router.navigate(["/dashboard/category/edit/" + id]);
        }
    }

    getExcelFile(catId) {
        this.auth.post("/api/Item/getItemsToExel", catId, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Get Item Of Category To Excel File (Category List)',
            logSource: 'dashboard',
            object: {
                catId: catId
            },
            table: "Category",
            tableObjectIds: [catId]
        }).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    var win = window.open(this.auth.apiUrl + data.redirect.substr(1), '_blank');
                    win.focus();
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    refreshDataSource() {
        this.selection.clear();

        this.auth
            .post("/api/Category/Get", {
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
                tableName: 'Category List',
                logSource: 'dashboard',
                object: {
                    sort: this.sort.active,
                    direction: this.sort.direction,
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    q: this.txtSearch
                },
                table: "Category"
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;
                        this.Category = data.data;

                        this.dataSource = new MatTableDataSource(this.Category);
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

    ngAfterContentInit(): void {

    }

    ngAfterViewInit(): void {
        this.refreshDataSource();
    }

    clearSelection() {
        $("#divtree").jstree("deselect_all");
        this.txtSearch = "";
        this.applyFilter("");
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
}

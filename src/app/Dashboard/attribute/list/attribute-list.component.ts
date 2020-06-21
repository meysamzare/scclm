import { Component, ViewChild, AfterViewInit, OnInit, AfterViewChecked, AfterContentInit, ElementRef } from "@angular/core";
import {
    MatTableDataSource,
    MatPaginator,
    MatSort,
    MatBottomSheet,
    PageEvent
} from "@angular/material";
import { IAttr } from "../attribute";
import { SelectionModel } from "@angular/cdk/collections";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { merge } from "rxjs";
import { ICategory } from "../../category/category";

declare var $: any;

@Component({
    templateUrl: "./attribute-list.component.html",
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
export class AttributeListComponent implements OnInit, AfterViewInit, AfterContentInit {
    displayedColumns: string[] = [
        "select",
        "id",
        "title",
        "catTitle",
        "attrTypeString",
        "unitTitle",
        "action"
    ];
    dataSource: MatTableDataSource<IAttr>;
    selection = new SelectionModel<IAttr>(true, []);

    attrs: IAttr[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    selectedCatId = null;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild("tree", { static: true }) tree: ElementRef;

    Categories: ICategory[] = [];


    TYPE = 0;

    pageTitle = "نمون برگ";
    pageTitles = "نمون برگ ها";
    pageUrl = "attribute";

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService,
        private bottomSheet: MatBottomSheet
    ) {

        this.activeroute.data.subscribe(data => {

            this.TYPE = data["Type"];

            if (this.TYPE == 1) {
                this.pageTitle = "آزمون آنلاین";
                this.pageTitles = "آزمون های آنلاین";
                this.pageUrl = "online-exam/option";
            }

            this.auth.post("/api/Category/getAllByType", this.TYPE).subscribe((data: jsondata) => {
                if (data.success) {
                    this.Categories = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
        });
    }


    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;

        return numSelected === this.getRowCanSelected();
    }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            rowCanSelect += 1;
        });

        return rowCanSelect;
    }

    haveAnyData(): boolean {
        return this.dataSource ? true : false;
    }

    getCurrentDataOfPage(): IAttr[] {
        let List: IAttr[];

        this.dataSource.connect().subscribe(rows => (List = rows));

        return List;
    }

    public resetSelection(event?: PageEvent) {
        this.selection.clear();
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.getCurrentDataOfPage().forEach(row =>
                this.selection.select(row)
            );
    }

    deleteSelected() {
        if (this.auth.isUserAccess(this.TYPE == 0 ? "remove_Attribute" : "remove_OnlineExamOption")) {
            if (this.selection.selected.length != 0) {

                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/Attribute/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Attribute',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: "Attribute",
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
        if (this.auth.isUserAccess(this.TYPE == 0 ? "edit_Attribute" : "edit_OnlineExamOption")) {
            this.router.navigate(["/dashboard/"+ this.pageUrl +"/edit/" + id]);
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
            selectedCatId: this.selectedCatId,
            Type: this.TYPE
        };

        this.auth
            .post("/api/Attribute/Get", obj, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Attribute List Get',
                logSource: 'dashboard',
                object: obj,
                table: "Attribute"
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;
                        this.attrs = data.data;

                        this.dataSource = new MatTableDataSource(this.attrs);
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

    clearSelection() {
        $("#divtree").jstree("deselect_all");
        this.selectedCatId = 0;
        this.applyFilter("");
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

    applyFilter(filterValue: string) {
        this.refreshDataSource();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}

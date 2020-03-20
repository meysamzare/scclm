import { Component, AfterViewInit, OnInit, ViewChild, AfterViewChecked, AfterContentInit, ElementRef } from "@angular/core";
import {
    MatTableDataSource,
    MatPaginator,
    MatSort,
    PageEvent
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { merge } from "rxjs";
import { IOrgChart } from "../orgchart";

declare var $: any;

@Component({
    templateUrl: "./orgchart-list.component.html",
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
export class OrgChartListComponent implements AfterContentInit, OnInit, AfterViewInit, AfterViewChecked {
    displayedColumns: string[] = [
        "select",
        "id",
        "name",
        "code",
        "parentTitle",
        "action"
    ];
    dataSource: MatTableDataSource<IOrgChart>;
    selection = new SelectionModel<IOrgChart>(true, []);

    OrgCharts: IOrgChart[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild("tree", { static: true }) tree: ElementRef;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService
    ) { }

    ngAfterViewChecked(): void {

    }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            if (!row.haveChildren && !row.havePerson) {
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

    getCurrentDataOfPage(): IOrgChart[] {
        let List: IOrgChart[];

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
                if (!row.haveChildren && !row.havePerson) {
                    this.selection.select(row);
                }
            });
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_OrgChart")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/OrgChart/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'OrgChart',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert(
                                "موارد انتخابی با موفقیت حذف شد"
                            );
                            this.refreshDataSource();

                            $("#divtree").jstree("refresh");
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
        if (this.auth.isUserAccess("edit_OrgChart")) {
            this.router.navigate(["/dashboard/orgchart/edit/" + id]);
        }
    }

    refreshDataSource() {
        this.selection.clear();

        this.auth
            .post("/api/OrgChart/Get", {
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
                tableName: 'OrgChart List',
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
                        this.OrgCharts = data.data;

                        this.dataSource = new MatTableDataSource(this.OrgCharts);
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
        var sanitizerUr = url => {
            return this.auth.serializeUrl(url);
        };

        let jstree = $(this.tree.nativeElement);

        jstree.jstree({
            plugins: ["wholerow", "types"],
            core: {
                data: {
                    url: function (node) {
                        return node.id === "#"
                            ? sanitizerUr("/api/OrgChart/GetTreeRoot")
                            : sanitizerUr(
                                "/api/OrgChart/GetTreeChildren/" + node.id
                            );
                    },
                    data: function (node) {
                        return { id: node.id };
                    }
                },
                strings: {
                    "Loading ...": "لطفا اندکی صبر نمایید"
                },
                multiple: false
            },
            types: {
                default: {
                    icon: "fa fa-folder"
                }
            }
        });

        $("#divtree").jstree("deselect_all");
        $("#divtree").jstree("refresh");
        $("#divtree").jstree("open_all");


        jstree.on("changed.jstree", (e, data) => {
            if (data.node) {
                this.txtSearch = data.node.text;
                this.refreshDataSource();
            }
        });

    }


    ngAfterViewInit(): void {
        this.refreshDataSource();
    }

    clearSelection() {
        $("#divtree").jstree("deselect_all");
        this.txtSearch = "";
        this.refreshDataSource();
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

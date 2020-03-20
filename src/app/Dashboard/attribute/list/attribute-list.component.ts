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

    selectedCatId = 0;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild("tree", { static: true }) tree: ElementRef;

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
        if (this.auth.isUserAccess("remove_Attribute")) {
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
        if (this.auth.isUserAccess("edit_Attribute")) {
            this.router.navigate(["/dashboard/attribute/edit/" + id]);
        }
    }

    refreshDataSource() {
        this.selection.clear();

        this.auth
            .post("/api/Attribute/Get", {
                getparams: {
                    sort: this.sort.active,
                    direction: this.sort.direction,
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    q: this.txtSearch
                },
                selectedCatId: this.selectedCatId
            }, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Attribute List',
                logSource: 'dashboard',
                object: {
                    getparams: {
                        sort: this.sort.active,
                        direction: this.sort.direction,
                        pageIndex: this.paginator.pageIndex,
                        pageSize: this.paginator.pageSize,
                        q: this.txtSearch
                    },
                    selectedCatId: this.selectedCatId
                },
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
                            ? sanitizerUr("/api/Category/GetTreeRoot")
                            : sanitizerUr(
                                "/api/Category/GetTreeChildren/" + node.id
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
        
        jstree.on('ready.jstree', () => {
            jstree.on("changed.jstree", (e, data) => {
                if (data.node) {
                    this.selectedCatId = data.node.id;
                    this.applyFilter("");
                }
            });
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

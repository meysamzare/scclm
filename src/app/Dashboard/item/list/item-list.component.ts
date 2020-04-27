import { Component, ViewChild, AfterViewInit, OnInit, AfterViewChecked, AfterContentInit, AfterContentChecked, ElementRef } from "@angular/core";
import {
    MatTableDataSource,
    MatPaginator,
    MatSort,
    MatBottomSheet,
    PageEvent,
    MatDialog
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { IItem } from "../item";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import {
    animate,
    state,
    style,
    transition,
    trigger
} from "@angular/animations";
import { ItemList } from "../item-list";
import { ItemListActiveDialogComponent } from "./item-list-active-dialog.component";
import { ItemListChangeAttrGroupComponent } from "./item-list-changeattr-group.component";
import { IAttr } from "../../attribute/attribute";
import { IItemAttr } from "../item-attr";
import { IUnit } from "../../unit/unit";
import { ShowImageComponent } from "src/app/shared/Modal/show-image.component";
import { AttrValSearch } from "../attr-val-search";
import { ItemEditLongTextSelectComponent } from "../edit/item-edit-long-text-select.component";
import { ItemListExcelAttrSelectComponent } from "./item-list-excel-attr-select.component";
import { Subject } from "rxjs/internal/Subject";
import { ICategory } from "../../category/category";
import { TreeService } from "src/app/shared/components/tree/tree.service";

declare var $: any;

@Component({
    templateUrl: "./item-list.component.html",
    animations: [
        trigger("detailExpand", [
            state(
                "collapsed",
                style({ height: "0px", minHeight: "0", display: "none" })
            ),
            state("expanded", style({ height: "*" })),
            transition(
                "expanded <=> collapsed",
                animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
            )
        ])
    ],
    styles: [
        `
            table {
            }

            tr.example-detail-row {
                height: 0;
            }

            tr.example-element-row:not(.example-expanded-row):hover {
                background: #f5f5f5;
            }

            tr.example-element-row:not(.example-expanded-row):active {
                background: #efefef;
            }

            .example-element-row td {
                border-bottom-width: 0;
            }

            .example-element-detail {
                overflow: hidden;
                display: flex;
            }

            .example-element-diagram {
                min-width: 80px;
                border: 2px solid black;
                padding: 8px;
                font-weight: lighter;
                margin: 8px 0;
                height: 104px;
            }

            .example-element-symbol {
                font-weight: bold;
                font-size: 40px;
                line-height: normal;
            }

            .example-element-description {
                padding: 16px;
            }

            .example-element-description-attribution {
                opacity: 0.5;
            }
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
            .font-11 {
                font-size: 11.5px;
            }
            .mg-r {
                margin-right: 5px;
            }

            .pad-td td th {
                padding: 10px;
            }

            .button-row {
                display: table-cell;
            }

            .button-row button {
                display: table-cell;
                margin: 10px;
            }

        `
    ]
})
export class ItemListComponent implements AfterContentInit, AfterViewInit, OnInit, AfterViewChecked {
    displayedColumns: string[] = [
        "select",
        "id",
        "title",
        "isActive",
        "rahCode",
        "categoryString",
        "date",
        "action"
    ];
    dataSource: MatTableDataSource<ItemList>;
    selection = new SelectionModel<ItemList>(true, []);

    items;

    isLoading: boolean;

    itemLength;

    isLoadingResults = true;

    txtSearch: string = "";

    selectedCatName = "";
    selectedCatId: number = null;

    showDietaledBox = false;
    showDietaleItem: IItem = new IItem();
    showDietaleAttrs: IAttr[] = [];
    showDietaleItemAttrs: IItemAttr[] = [];

    searchAttrVals: AttrValSearch[] = [];
    searchedAttrs: IAttr[] = [];

    units: IUnit[] = [];

    state: string | "both" | "active" | "deactive" = "both";

    selectedItemList: IItem[] = [];
    dataSourceSelectedItemList: MatTableDataSource<IItem>;

    showSelectedItemList = false;

    displayedColumnsForSelectedItem: string[] = [
        "id",
        "title",
        "isActive",
        "rahCode",
        "categoryString",
        "date",
        "action"
    ];

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    expandedElement: ItemList | null;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService,
        private bottomSheet: MatBottomSheet,
        public dialog: MatDialog,
        public tree: TreeService
    ) {
    }

    ngAfterContentInit(): void {
    }


    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === this.getRowCanSelected();
    }

    haveAnyData(): boolean {
        return this.dataSource ? true : false;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.getCurrentDataOfPage().forEach(row =>
                this.selection.select(row)
            );
    }

    getCurrentDataOfPage(): ItemList[] {
        let List: ItemList[];

        this.dataSource.connect().subscribe(rows => (List = rows));

        return List;
    }

    getItemAttrVal(attrId): string {
        var a = this.items.itemAttribute.find(c => c.attributeId == attrId);

        if (a) {
            return a.attrubuteValue;
        }

        return "";
    }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            rowCanSelect += 1;
        });

        return rowCanSelect;
    }

    public resetSelection(event?: PageEvent) {
        this.selection.clear();
        this.refreshDataSource();
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_Item")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                ids.forEach(id => {
                    if (
                        !this.auth.checkForMatchRole(
                            this.items.find(c => c.id == id).categoryRoleAccess
                        )
                    ) {
                        return;
                    } else {
                        this.auth.post("/api/Item/Delete", ids, {
                            type: 'Delete',
                            agentId: this.auth.getUserId(),
                            agentType: 'User',
                            agentName: this.auth.getUser().fullName,
                            tableName: 'Item',
                            logSource: 'dashboard',
                            deleteObjects: deleteDatas,
                            table: "Item",
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
                                    this.message.showMessageforFalseResult(
                                        data
                                    );
                                }
                            },
                            er => {
                                this.auth.handlerError(er);
                            }
                        );
                    }
                });
            }
        }
    }

    deleteRow(id) {
        if (this.auth.isUserAccess("remove_Item")) {
            if (
                this.auth.checkForMatchRole(
                    this.items.find(c => c.id == id).categoryRoleAccess
                )
            ) {
                let ids: number[] = [];

                ids.push(id);

                var deleteDatas = [this.items.find(c => c.id == id)];

                this.auth.post("/api/Item/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Item',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: "Item",
                    tableObjectIds: ids
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert(
                                "مورد انتخابی با موفقیت حذف شد"
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

    showDietaleOfItem(itemId, categoryId) {
        if (this.auth.isUserAccess("view_Item")) {
            if (
                this.auth.checkForMatchRole(
                    this.items.find(c => c.id == itemId).categoryRoleAccess
                )
            ) {
                this.showDietaleItem = this.items.find(c => c.id == itemId);

                this.auth
                    .post("/api/Item/getItemAttrForItem", itemId)
                    .subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.showDietaleItemAttrs = data.data;
                            } else {
                                this.message.showMessageforFalseResult(data);
                            }
                        },
                        er => {
                            this.auth.handlerError(er);
                        }
                    );

                this.auth
                    .post("/api/Attribute/getAttrsForCat", categoryId)
                    .subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.showDietaleAttrs = data.data;
                            } else {
                                this.message.showMessageforFalseResult(data);
                            }
                        },
                        er => {
                            this.auth.handlerError(er);
                        }
                    );

                this.showDietaledBox = true;
            }
        }
    }

    getAttrsForUnit(unitId): IAttr[] {
        return this.showDietaleAttrs.filter(c => c.unitId == unitId);
    }

    getItemAttrValDietale(attrId): string {
        var a = this.showDietaleItemAttrs.find(c => c.attributeId == attrId);

        if (a) {
            return a.attrubuteValue;
        }

        return "";
    }

    getItemAttrUrlDietale(attrId): string {
        var a = this.showDietaleItemAttrs.find(c => c.attributeId == attrId);

        if (a) {
            return this.auth.apiUrl + a.attributeFilePath.substr(1);
        }

        return "";
    }

    Categories: ICategory[] = [];
    pinedCategories: ICategory[] = [];

    selectedPinedCat = null;

    ngOnInit() {
        this.paginator.pageSize =
            this.activeroute.snapshot.queryParams["pagesize"] || 5;
        this.paginator.pageIndex =
            this.activeroute.snapshot.queryParams["page"] || 0;
        this.sort.direction =
            this.activeroute.snapshot.queryParams["dir"] || "";
        this.sort.active = this.activeroute.snapshot.queryParams["sort"] || "";
        this.txtSearch = this.activeroute.snapshot.queryParams["q"] || "";

        this.auth.post("/api/Unit/GetAll", null).subscribe((data: jsondata) => {
            if (data.success) {
                this.units = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        });

        this.auth.post("/api/Category/GetAll").subscribe((data: jsondata) => {
            if (data.success) {
                this.Categories = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        });

        this.auth.post("/api/Category/GetAllPined").subscribe((data: jsondata) => {
            if (data.success) {
                this.pinedCategories = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        });

    }

    pinedCatSelect(id: number) {
        if (this.selectedPinedCat == id) {
            this.selectedCatId = null;
        } else {
            this.selectedCatId = id;
            this.selectedPinedCat = id;
        }

        this.onCategorySelectChange();
    }


    onCategorySelectChange() {
        if (this.selectedCatId) {

            this.selectedPinedCat = this.selectedCatId;

            let cat = this.Categories.find(c => c.id == this.selectedCatId);

            this.selectedCatName = cat.title;
            this.searchAttrVals = [];

            this.auth
                .post("/api/Category/getSearchedAttrs", this.selectedCatId)
                .subscribe((data: jsondata) => {
                    if (data.success) {
                        this.searchedAttrs = data.data;
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                });

            this.paginator.firstPage();

            this.refreshDataSource();
        } else {
            this.clearCatSelection();
        }
    }


    clearCatSelection() {
        this.selectedCatName = "";
        this.selectedCatId = null;
        this.selectedPinedCat = null;
        this.searchedAttrs = [];
        this.searchAttrVals = [];
        this.refreshDataSource();
    }

    onEdit(id) {
        if (this.auth.isUserAccess("edit_Item")) {
            if (
                this.auth.checkForMatchRole(
                    this.items.find(c => c.id == id).categoryRoleAccess
                )
            ) {
                this.router.navigate(["/dashboard/item/edit/" + id], {
                    queryParams: {
                        pagesize: this.paginator.pageSize,
                        page: this.paginator.pageIndex,
                        dir: this.sort.direction,
                        sort: this.sort.active,
                        q: this.txtSearch
                    }
                });
            }
        }
    }

    refreshDataSource() {
        this.router.navigate(["."], {
            relativeTo: this.activeroute,
            queryParams: {
                pagesize: this.paginator.pageSize,
                page: this.paginator.pageIndex,
                dir: this.sort.direction,
                sort: this.sort.active,
                q: this.txtSearch
            }
        });

        this.auth
            .post("/api/Item/Get", {
                param: {
                    sort: this.sort.active,
                    direction: this.sort.direction,
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    q: this.txtSearch
                },
                catName: this.selectedCatName,
                attrvalsearch: this.searchAttrVals,
                state: this.state
            }, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Get Item List',
                logSource: 'dashboard',
                object: {
                    param: {
                        sort: this.sort.active,
                        direction: this.sort.direction,
                        pageIndex: this.paginator.pageIndex,
                        pageSize: this.paginator.pageSize,
                        q: this.txtSearch
                    },
                    catName: this.selectedCatName,
                    attrvalsearch: this.searchAttrVals,
                    state: this.state
                },
                table: "Item"
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;
                        this.items = data.data;

                        this.dataSource = new MatTableDataSource(this.items);
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

    ngAfterViewChecked(): void {

    }

    ngAfterViewInit(): void {
        this.activeroute.queryParams.subscribe(qparam => {
            this.paginator.pageSize =
                this.activeroute.snapshot.queryParams["pagesize"] || 5;
            this.paginator.pageIndex =
                this.activeroute.snapshot.queryParams["page"] || 0;
            this.sort.direction =
                this.activeroute.snapshot.queryParams["dir"] || "";
            this.sort.active =
                this.activeroute.snapshot.queryParams["sort"] || "";
            this.txtSearch = this.activeroute.snapshot.queryParams["q"] || "";
        });


        // const ex = merge(
        //     this.sort.sortChange,
        //     this.paginator.page
        // );

        // ex.subscribe(() => {
        //     alert("changed")
        // })

        this.refreshDataSource();
    }

    clearSelection() {
        $("#divtree").jstree("deselect_all");
        this.selectedCatName = "";
        this.selectedCatId = null;
        this.searchedAttrs = [];
        this.searchAttrVals = [];
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

    setIsActive(id, isActive) {
        if (this.auth.isUserAccess("edit_Item")) {
            if (
                this.auth.checkForMatchRole(
                    this.items.find(c => c.id == id).categoryRoleAccess
                )
            ) {
                if (isActive) {
                    var catId = 0;

                    if (this.selectedCatName) {
                        catId = this.selectedCatId;
                    } else {
                        catId = this.getCurrentDataOfPage().find(
                            c => c.id == id
                        ).category.id;
                    }

                    const dialogRef = this.dialog.open(
                        ItemListActiveDialogComponent,
                        {
                            data: {
                                id: id,
                                catId: catId,
                                title: this.getCurrentDataOfPage().find(
                                    c => c.id == id
                                ).title
                            }
                        }
                    );

                    dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            this.auth
                                .post("/api/Item/ChangeActiveState", {
                                    id: id,
                                    isActive: true
                                })
                                .subscribe(
                                    (data: jsondata) => {
                                        if (data.success) {
                                            this.items[
                                                this.items.findIndex(
                                                    c => c.id == id
                                                )
                                            ].isActive = isActive;

                                            this.dataSource = new MatTableDataSource(
                                                this.items
                                            );
                                        } else {
                                            this.message.showMessageforFalseResult(
                                                data
                                            );
                                        }
                                    },
                                    er => {
                                        this.auth.handlerError(er);
                                    }
                                );
                        }
                    });
                } else {
                    this.auth
                        .post("/api/Item/ChangeActiveState", {
                            id: id,
                            isActive: isActive
                        })
                        .subscribe(
                            (data: jsondata) => {
                                if (data.success) {
                                    this.items[
                                        this.items.findIndex(c => c.id == id)
                                    ].isActive = isActive;

                                    this.dataSource = new MatTableDataSource(
                                        this.items
                                    );
                                } else {
                                    this.message.showMessageforFalseResult(
                                        data
                                    );
                                }
                            },
                            er => {
                                this.auth.handlerError(er);
                            }
                        );
                }
            }
        }
    }

    setIsActiveGroup(isActive) {
        if (this.auth.isUserAccess("edit_Item")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var havePermision = true;

                ids.forEach(id => {
                    if (
                        !this.auth.checkForMatchRole(
                            this.items.find(c => c.id == id).categoryRoleAccess
                        )
                    ) {
                        havePermision = false;
                        return;
                    } else {
                        havePermision = true;
                    }
                });

                if (havePermision) {
                    this.auth
                        .post("/api/Item/ChangeActiveStateGroup", {
                            ids: ids,
                            isActive: isActive
                        })
                        .subscribe(
                            (data: jsondata) => {
                                if (data.success) {
                                    ids.forEach(id => {
                                        this.items[
                                            this.items.findIndex(
                                                c => c.id == id
                                            )
                                        ].isActive = isActive;
                                    });

                                    this.dataSource = new MatTableDataSource(
                                        this.items
                                    );
                                    this.selection.clear();
                                } else {
                                    this.message.showMessageforFalseResult(
                                        data
                                    );
                                }
                            },
                            er => {
                                this.auth.handlerError(er);
                            }
                        );
                }
            }
        }
    }

    openChahngeGroupDialog() {
        if (this.auth.isUserAccess("edit_Item")) {
            var selectedData = this.selection.selected;

            let ids: number[] = [];
            selectedData.forEach(row => ids.push(row.id));

            var havePermision = true;

            ids.forEach(id => {
                if (
                    !this.auth.checkForMatchRole(
                        this.items.find(c => c.id == id).categoryRoleAccess
                    )
                ) {
                    havePermision = false;
                    return;
                } else {
                    havePermision = true;
                }
            });

            if (havePermision) {
                var haveSameCategory = selectedData.every(
                    val => val.category.id === selectedData[0].category.id
                );

                if (haveSameCategory) {
                    const dialogRef = this.dialog.open(
                        ItemListChangeAttrGroupComponent,
                        {
                            data: {
                                catId: selectedData[0].category.id,
                                selectedItemsIds: ids
                            }
                        }
                    );

                    dialogRef.afterClosed().subscribe(res => {
                        this.selection.clear();
                    });
                } else {
                    this.message.showWarningAlert(
                        " مقادیر انتخاب شده می بایست دارای یک نمون برگ باشند "
                    );
                    this.selection.clear();
                }
            }
        }
    }

    addSearchAttrVal(attrId, event) {
        let val;
        if (event.target) {
            val = event.target.value;
        } else {
            val = event.checked;
        }

        var i = this.searchAttrVals.find(c => c.attrId == attrId);

        if (i) {
            if (val === "") {
                this.searchAttrVals.splice(this.searchAttrVals.indexOf(i), 1);
            }
            i.val = val;
        } else {
            this.searchAttrVals.push({
                attrId: attrId,
                val: val
            });
        }

        this.refreshDataSource();
    }

    getSearchAttrVal(attrId) {
        var i = this.searchAttrVals.find(c => c.attrId == attrId);

        if (i) {
            return i.val;
        } else {
            return "";
        }
    }

    clearSearchAttrVals() {
        this.searchAttrVals = [];
        this.refreshDataSource();
    }

    addSearchAttrValForSelect(attrId, event) {
        let val = event;

        var i = this.searchAttrVals.find(c => c.attrId == attrId);

        if (i) {
            if (val === "") {
                this.searchAttrVals.splice(this.searchAttrVals.indexOf(i), 1);
            }
            i.val = val;
        } else {
            if (val != "") {
                this.searchAttrVals.push({
                    attrId: attrId,
                    val: val
                });
            }
        }

        this.refreshDataSource();
    }

    openc(picker) {
        picker.open();
    }

    getShiftedItem(items: string) {
        var a = items.substring(1);

        return a.split(",");
    }

    showDialogforLongSelect(longVal) {
        const dialogRef = this.dialog.open(ItemEditLongTextSelectComponent, {
            data: {
                text: longVal
            }
        });
    }

    showPopupImage(imgUrl) {
        const dialog = this.dialog.open(ShowImageComponent, {
            data: {
                url: imgUrl
            }
        });
    }

    setState(state) {
        this.state = state;

        this.refreshDataSource();
    }

    getExcelFileOfList() {
        const dialog = this.dialog.open(ItemListExcelAttrSelectComponent, {
            data: {
                catId: this.selectedCatId
            }
        });

        dialog.afterClosed().subscribe(data => {
            if (data) {
                this.auth
                    .post("/api/Item/getExcelFileOfList", {
                        param: {
                            sort: this.sort.active,
                            direction: this.sort.direction,
                            pageIndex: this.paginator.pageIndex,
                            pageSize: this.paginator.pageSize,
                            q: this.txtSearch
                        },
                        catName: this.selectedCatName,
                        attrvalsearch: this.searchAttrVals,
                        state: this.state,
                        catId: this.selectedCatId,
                        selectedAttrs: data
                    })
                    .subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                var win = window.open(
                                    this.auth.apiUrl + data.redirect.substr(1),
                                    "_blank"
                                );
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
        });
    }

    applyFilter(filterValue: string) {
        this.paginator.firstPage();

        this.refreshDataSource();

        this.selection.clear();
    }

    addToSelectedList(row: IItem) {
        if (
            this.auth.checkForMatchRole(
                this.items.find(c => c.id == row.id).categoryRoleAccess
            )
        ) {
            this.showSelectedItemList = true;

            var item = this.selectedItemList.find(c => c.id == row.id);

            if (this.selectedItemList.length != 0) {
                var haveSameCategory =
                    row.categoryId == this.selectedItemList[0].categoryId;
                if (!haveSameCategory) {
                    this.message.showWarningAlert(
                        "ردیف انتخابی باید با موارد لیست، دارای یک نمون برگ باشند"
                    );
                    return;
                }
            }

            if (item) {
                this.message.showInfoAlert(
                    "این ردیف قبلا افزوده شده است",
                    "اعلان"
                );
            } else {
                this.selectedItemList.push(row);
                this.dataSourceSelectedItemList = new MatTableDataSource(
                    this.selectedItemList
                );
            }
        }
    }

    closeSelectedList() {
        this.selectedItemList = [];
        this.dataSourceSelectedItemList = new MatTableDataSource(
            this.selectedItemList
        );
        this.showSelectedItemList = false;
    }

    deleteSelectedListRow(row: IItem) {
        var item = this.selectedItemList.find(c => c.id == row.id);

        if (item) {
            this.selectedItemList.splice(
                this.selectedItemList.indexOf(item),
                1
            );
            this.dataSourceSelectedItemList = new MatTableDataSource(
                this.selectedItemList
            );
            if (this.selectedItemList.length == 0) {
                this.showSelectedItemList = false;
            }
        }
    }

    searchFromSelectedList(text) {
        this.txtSearch = text;
        this.refreshDataSource();
    }

    isItemExistInSelectedItemList(row: IItem): boolean {
        var item = this.selectedItemList.find(c => c.id == row.id);

        if (item) {
            return true;
        } else {
            return false;
        }
    }

    deleteSelectedItemList() {
        if (this.auth.isUserAccess("remove_Item")) {
            var ids: number[] = [];

            this.selectedItemList.forEach(item => {
                ids.push(item.id);
            });

            this.auth.post("/api/Item/Delete", ids).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.message.showSuccessAlert(
                            "موارد انتخابی با موفقیت حذف شد"
                        );
                        this.refreshDataSource();
                        this.selection.clear();
                        this.selectedItemList = [];
                        this.showSelectedItemList = false;
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

    chengGroupSelectedItemList() {
        if (this.auth.isUserAccess("edit_Item")) {
            let ids: number[] = [];
            this.selectedItemList.forEach(item => {
                ids.push(item.id);
            });

            var havePermision = true;

            ids.forEach(id => {
                if (
                    !this.auth.checkForMatchRole(
                        this.selectedItemList.find(c => c.id == id)
                            .categoryRoleAccess
                    )
                ) {
                    havePermision = false;
                    return;
                } else {
                    havePermision = true;
                }
            });

            if (havePermision) {
                const dialogRef = this.dialog.open(
                    ItemListChangeAttrGroupComponent,
                    {
                        data: {
                            catId: this.selectedItemList[0].categoryId,
                            selectedItemsIds: ids
                        }
                    }
                );

                dialogRef.afterClosed().subscribe(res => { });
            }
        }
    }

    setIsActiveGroupSelectedItemList(isActive) {
        if (this.auth.isUserAccess("edit_Item")) {
            let ids: number[] = [];

            this.selectedItemList.forEach(item => {
                ids.push(item.id);
            });

            var havePermision = true;

            ids.forEach(id => {
                if (
                    !this.auth.checkForMatchRole(
                        this.selectedItemList.find(c => c.id == id)
                            .categoryRoleAccess
                    )
                ) {
                    havePermision = false;
                    return;
                } else {
                    havePermision = true;
                }
            });

            if (havePermision) {
                this.auth
                    .post("/api/Item/ChangeActiveStateGroup", {
                        ids: ids,
                        isActive: isActive
                    })
                    .subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                ids.forEach(id => {
                                    var i = this.items.find(c => c.id == id);

                                    if (i) {
                                        this.items[
                                            this.items.findIndex(
                                                c => c.id == id
                                            )
                                        ].isActive = isActive;
                                    }

                                    this.selectedItemList[
                                        this.selectedItemList.findIndex(
                                            c => c.id == id
                                        )
                                    ].isActive = isActive;
                                });

                                this.refreshDataSource();
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

    setIsActiveSelectedItemList(id, isActive) {
        if (this.auth.isUserAccess("edit_Item")) {
            if (
                this.auth.checkForMatchRole(
                    this.selectedItemList.find(c => c.id == id)
                        .categoryRoleAccess
                )
            ) {
                if (isActive) {
                    var catId = this.selectedItemList[0].categoryId;

                    const dialogRef = this.dialog.open(
                        ItemListActiveDialogComponent,
                        {
                            data: {
                                id: id,
                                catId: catId,
                                title: this.selectedItemList.find(
                                    c => c.id == id
                                ).title
                            }
                        }
                    );

                    dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            this.auth
                                .post("/api/Item/ChangeActiveState", {
                                    id: id,
                                    isActive: true
                                })
                                .subscribe(
                                    (data: jsondata) => {
                                        if (data.success) {
                                            this.selectedItemList[
                                                this.selectedItemList.findIndex(
                                                    c => c.id == id
                                                )
                                            ].isActive = isActive;

                                            var i = this.items.find(
                                                c => c.id == id
                                            );

                                            if (i) {
                                                this.items[
                                                    this.items.findIndex(
                                                        c => c.id == id
                                                    )
                                                ].isActive = isActive;
                                            }

                                            this.refreshDataSource();

                                        } else {
                                            this.message.showMessageforFalseResult(
                                                data
                                            );
                                        }
                                    },
                                    er => {
                                        this.auth.handlerError(er);
                                    }
                                );
                        }
                    });
                } else {
                    this.auth
                        .post("/api/Item/ChangeActiveState", {
                            id: id,
                            isActive: isActive
                        })
                        .subscribe(
                            (data: jsondata) => {
                                if (data.success) {
                                    this.selectedItemList[
                                        this.selectedItemList.findIndex(
                                            c => c.id == id
                                        )
                                    ].isActive = false;

                                    var i = this.items.find(c => c.id == id);

                                    if (i) {
                                        this.items[
                                            this.items.findIndex(
                                                c => c.id == id
                                            )
                                        ].isActive = false;
                                    }

                                    this.refreshDataSource();

                                } else {
                                    this.message.showMessageforFalseResult(
                                        data
                                    );
                                }
                            },
                            er => {
                                this.auth.handlerError(er);
                            }
                        );
                }
            }
        }
    }
}

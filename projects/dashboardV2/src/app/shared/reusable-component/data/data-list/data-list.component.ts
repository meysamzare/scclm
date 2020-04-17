import { Component, OnInit, ViewChild, AfterViewInit, ContentChildren, QueryList, AfterContentInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatSortHeader } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { DataListItemDirective } from './data-list-item.directive';
import { merge } from 'rxjs/internal/observable/merge';
import { finalize, debounceTime, take } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { DataListFilterItemDirective } from './data-list-filter-item.directive';
import { Location } from '@angular/common';
import { MenuService } from '../../../services/menu/menu.service';

@Component({
    selector: 'app-data-list',
    templateUrl: './data-list.component.html',
    styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit, AfterViewInit, AfterContentInit {

    @Input() PAGE_TITLE = "";
    @Input() PAGE_ROLE = "";
    @Input() PAGE_TITLES: string;
    @Input() PAGE_APIURL: string;
    @Input() PAGE_URL: string;


    @Input() showSelect = true;
    @Input() showAction = true;

    @Input() conditionalProperty = "";
    @Input() conditionalTitle = "";

    @Input() tooltipalProperty = "name";

    @Input() pageSizeOptions = [5, 10, 15, 20, 25];


    @Input() introUrl = "../";

    @Input() staticData: any[] = [];

    @Output() editClick = new EventEmitter<any>();
    @Output() deleteClick = new EventEmitter<any>();


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    @ContentChildren(DataListItemDirective) items: QueryList<DataListItemDirective>;
    @ContentChildren(DataListFilterItemDirective) filters: QueryList<DataListFilterItemDirective>;

    showSearch = false;

    columns: {
        def: string,
        title: string,
        show: boolean
    }[] = [];

    dataSource: MatTableDataSource<any>;
    selection = new SelectionModel<any>(true, []);

    PAGE_Datas: any[] = [];

    isLoadingResults = false;

    txtSearch: string = "";

    filter$ = new Subject();

    itemLength = null;

    filterDatas: {
        title: string,
        name: string,
        value: any
    }[] = [];

    constructor(
        private router: Router,
        private auth: AuthService,
        private message: MessageService,
        public location: Location,
        private activeroute: ActivatedRoute,
        private menu: MenuService
    ) {
        this.filter$.pipe(
            debounceTime(500)
        ).subscribe(() => this.applyFilter());
    }

    ngOnInit() {

        if (!this.PAGE_TITLE) {
            this.PAGE_TITLE = this.menu.getCurrentPureUrl().title;
        }

        if (!this.PAGE_TITLES) {
            this.PAGE_TITLES = this.menu.getCurrentPureUrl().titles;
        }

        this.paginator.pageSizeOptions = this.pageSizeOptions;
        this.paginator.pageSize = 5;

        const changeed = merge(this.sort.sortChange, this.paginator.page);

        changeed.subscribe(() => {
            this.refreshDataSource();
        });

        if (!this.PAGE_APIURL) {
            this.PAGE_APIURL = this.menu.getCurrentPureUrl().apiUrl;
        }

        if (!this.PAGE_ROLE) {
            this.PAGE_ROLE = this.menu.getCurrentPureUrl().role;
        }
    }

    ngAfterViewInit(): void {
        if (this.staticData.length == 0) {
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

                if (this.txtSearch) {
                    this.showSearch = true;
                }

                this.sort.sortChange.next();
            });
        }
    }

    ngAfterContentInit(): void {

        // Cols----------------------
        if (this.showSelect) {
            this.columns.push({
                def: "select",
                title: "انتخاب",
                show: true
            });
        }


        if (this.items) {
            this.items.forEach(item => {
                this.columns.push({
                    def: item._def,
                    title: item._title,
                    show: item._show
                });
            });

        }


        if (this.showAction) {
            this.columns.push({
                def: "action",
                title: "عملیات",
                show: true
            });
        }
        // /Cols----------------------


        // Filters------------------------------
        if (this.filters) {
            this.filters.forEach(filter => {
                this.filterDatas.push({
                    name: filter.model.name,
                    title: filter.title,
                    value: null
                });

                filter.modelValue$.subscribe(value => {
                    this.filterDatas.find(c => c.name == filter.model.name).value = value;
                    this.paginator.firstPage();
                    this.filter$.next();
                });
            });
        }
        // /Filters------------------------------

        this.refreshDataSource();

    }

    toggleCol(def: string, show: boolean) {
        this.columns.find(c => c.def == def).show = show;
    }

    getFiltersByType(type: string) {
        if (this.filters) {
            return this.filters.toArray().filter(c => c.type == type);
        }

        return [];
    }

    isAnyAppliedFilter(): boolean {
        return this.filterDatas.some(c => c.value);
    }

    clearFilterValue(name: string) {
        this.filterDatas.find(c => c.name == name).value = null;

        this.filters.find(c => c.name == name).clearValue();

        this.filter$.next();
    }

    @HostListener("document:keydown.alt.c")
    clearAllFilters() {
        this.filterDatas.map(data => {
            data.value = null;
        });

        this.filters.map(filter => {
            filter.clearValue();
        });

        this.filter$.next();
    }
    isLastItemInDisplayCol(def: string): boolean {
        if (this.columns.filter(c => c.show).length == 2) {
            let item = this.columns.filter(c => c.show).find(c => c.def == def);

            return item ? true : false;
        }

        return false;
    }

    getDisplayedCols() {
        return this.columns.filter(c => c.show).map(c => c.def);
    }

    @HostListener("document:keydown.esc")
    toggleSearch() {
        this.showSearch = !this.showSearch;

        if (this.showSearch == false) {
            this.clearSearch();
        }
    }

    clearSearch() {
        let searchBefore = this.txtSearch;
        if (searchBefore) {
            this.txtSearch = '';
            this.filter$.next();
        }
    }

    isRowSelected(row): boolean {
        return this.selection.isSelected(row);
    }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            if (!this.haveConditionalProperty(row)) {
                rowCanSelect += 1;
            }
        });

        return rowCanSelect;
    }

    haveConditionalProperty(row): boolean {
        if (this.conditionalProperty) {
            let condArrey = this.conditionalProperty.split(",");

            let haveAny = false

            condArrey.forEach(cond => {
                if (row[cond]) {
                    haveAny = true;
                }
            });

            return haveAny;
        }

        return false;
    }

    getConditionalMessage(row): string {
        if (this.haveConditionalProperty(row)) {
            return `این ${this.PAGE_TITLE} دارای ${this.conditionalTitle} است، نمیتوان آن را حذف کرد`;
        }

        return `انتخاب برای حذف`;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;

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
        return this.PAGE_Datas.length != 0 ? true : false;
    }

    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.getCurrentDataOfPage().forEach(row => {
                if (!this.haveConditionalProperty(row)) {
                    this.selection.select(row);
                }
            });
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_" + this.PAGE_ROLE) && this.selection.selected.length != 0) {
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
                }).subscribe(data => {
                    if (data.success) {
                        this.message.showSuccessAlert(
                            "موارد انتخابی با موفقیت حذف شد"
                        );
                        this.refreshDataSource();
                        this.selection.clear();
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                });
            }
        }
    }

    onEdit(id) {
        if (this.auth.isUserAccess("edit_" + this.PAGE_ROLE)) {
            this.router.navigateByUrl(`${this.menu.getCurrentPureUrl().link}/edit/${id}`);
        }
    }

    @HostListener("document:keydown.arrowright")
    nextPage() {
        this.paginator.nextPage();
    }

    @HostListener("document:keydown.arrowleft")
    prevPage() {
        this.paginator.previousPage();
    }

    @HostListener("document:keydown.control.arrowright")
    lastPage() {
        this.paginator.lastPage();
    }

    @HostListener("document:keydown.control.arrowleft")
    firstPage() {
        this.paginator.firstPage();
    }

    @HostListener("document:keydown.alt.r")
    refreshDataSource() {
        if (this.staticData.length != 0) {
            this.dataSource = new MatTableDataSource(this.staticData);
        } else {
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

            this.isLoadingResults = true;

            this.selection.clear();

            var obj = null;

            obj = {
                sort: this.sort.active || "",
                direction: this.sort.direction || "",
                pageIndex: this.paginator.pageIndex || 0,
                pageSize: this.paginator.pageSize || 5,
                q: this.txtSearch
            };

            if (this.filterDatas.length != 0) {
                obj = {
                    getparams: {
                        sort: this.sort.active || "",
                        direction: this.sort.direction || "",
                        pageIndex: this.paginator.pageIndex || 0,
                        pageSize: this.paginator.pageSize || 5,
                        q: this.txtSearch
                    },
                }

                this.filterDatas.forEach(data => {
                    obj[data.name] = data.value || "";
                });
            }

            let url = `/api/${this.PAGE_APIURL}/Get`;

            this.auth.post(url, obj, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: this.PAGE_APIURL + ' List Get Method',
                logSource: 'dashboard',
                object: obj,
            }).pipe(
                finalize(() => this.isLoadingResults = false)
            ).subscribe(data => {
                if (data.success) {
                    this.itemLength = data.type;
                    this.PAGE_Datas = data.data;

                    this.dataSource = new MatTableDataSource(this.PAGE_Datas);
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }



    applyFilter() {
        if (this.paginator) {
            this.paginator.firstPage();
        }

        this.refreshDataSource();
    }

}

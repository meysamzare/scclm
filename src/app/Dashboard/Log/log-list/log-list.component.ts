import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge, Subject } from 'rxjs';
import { ViewLogDescComponent } from '../view-log-desc/view-log-desc.component';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

export class ILog {
    id: number;
    event: string;
    desc: string;
    ip: string;
    dateString: string;
    agentId: string;
    agnetType: string;
    agentName: string;
    logSource: string;
}

@Component({
    selector: 'app-log-list',
    templateUrl: './log-list.component.html',
    styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit {
    displayedColumns: string[] = [
        "event",
        "logSource",
        "agentType",
        "agent",
        "table",
        "ip",
        "date",
        "desc",
    ];

    tables: { name; desc; }[] = [
        { name: "Attribute", desc: "فیلد" },
        { name: "Category", desc: "نمون برگ" },
        { name: "Chat", desc: "گفتگو" },
        { name: "ExamAnalyze", desc: "تحلیل آزمون ها" },
        { name: "WorkbookComparison", desc: "کارنامه قیاسی" },
        { name: "WorkbookByClassComparison", desc: "جزئیات کارنامه براساس کلاس" },
        { name: "Class", desc: "کلاس" },
        { name: "Course", desc: "درس" },
        { name: "Education", desc: "مدرک تحصیلی" },
        { name: "Exam", desc: "آزمون" },
        { name: "ExamScore", desc: "نمره" },
        { name: "ExamType", desc: "نوع آزمون" },
        { name: "Contract", desc: "قرارداد" },
        { name: "ContractType", desc: "نوع قرارداد" },
        { name: "PaymentType", desc: "نوع پرداخت" },
        { name: "StdPayment", desc: "پرداخت دانش آموز" },
        { name: "Grade", desc: "پایه" },
        { name: "Insurance", desc: "بیمه" },
        { name: "Item", desc: "اطلاعات نمون برگ" },
        { name: "Notification", desc: "اعلامیه" },
        { name: "OrgChart", desc: "چارت سازمانی" },
        { name: "OrgPerson", desc: "پرسنل" },
        { name: "Link", desc: "فایل" },
        { name: "Product", desc: "محصولات" },
        { name: "ProductCategory", desc: "دسته بندی محصولات" },
        { name: "Writer", desc: "نویسنده" },
        { name: "Question", desc: "سوال" },
        { name: "QuestionOption", desc: "گزینه سوال" },
        { name: "Role", desc: "سطح دسترسی" },
        { name: "Salary", desc: "حکم کارگزینی" },
        { name: "ClassBook", desc: "دفتر کلاسی" },
        { name: "Student", desc: "دانش آموز" },
        { name: "StdClassMng", desc: "ثبت نامی دانش آموز" },
        { name: "ScoreThemplate", desc: "شابلون امتیازات" },
        { name: "StudentScore", desc: "امتیاز دانش آموز" },
        { name: "StudentType", desc: "گروه دانش آموز" },
        { name: "Teacher", desc: "دبیر" },
        { name: "Ticket", desc: "مکاتبات" },
        { name: "TimeAndDays", desc: "ایام هفته" },
        { name: "TimeSchedule", desc: "زمانبندی" },
        { name: "Titute", desc: "آموزشگاه" },
        { name: "Unit", desc: "واحد" },
        { name: "User", desc: "کاربر" },
        { name: "Advertising", desc: "تبلیغ" },
        { name: "BestStudent", desc: "دانش آموز برتر" },
        { name: "Comment", desc: "نظر" },
        { name: "Picture", desc: "تصویر" },
        { name: "PictureGallery", desc: "گالری تصویر" },
        { name: "MainSlideShow", desc: "اسلاید شو اصلی" },
        { name: "Post", desc: "پست" },
        { name: "Schedule", desc: "رویداد" },
        { name: "Workbook", desc: "کارنامه" },
        { name: "Yeareducation", desc: "سال تحصیلی" },
        { name: "Log", desc: "لاگ های سیستم" },
    ];

    selectedTable = null;
    selectedId = "";
    dateStart = "";
    dateEnd = "";

    dataSource: MatTableDataSource<ILog>;
    selection = new SelectionModel<ILog>(true, []);

    PAGE_Datas: ILog[] = [];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;


    PAGE_TITLE = "لاگ های سیستم";
    PAGE_TITLES = "لاگ های سیستم";
    PAGE_APIURL = "Log";
    PAGE_URL = "Log";
    PAGE_ROLE = "Log";

    selectedEvent: string = null;
    selectedLogSource: string = null;
    selectedAgentType: string = null;


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService,
        private dialog: MatDialog
    ) {
        this.filter$.pipe(
            debounceTime(1000)
        ).subscribe(() => this.refreshDataSource());
    }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            if (false) {
                rowCanSelect += 1;
            }
        });

        return rowCanSelect;
    }

    openc(picker) {
        picker.open();
    }

    getTableDesc(name) {
        let tbl = this.tables.find(c => c.name == name);

        if (tbl) {
            return tbl.desc;
        }

        return "---"
    }
    
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;

        return numSelected === this.getRowCanSelected();
    }

    getCurrentDataOfPage(): ILog[] {
        let List: ILog[];

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
                if (false) {
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
            getparam: {
                sort: this.sort.active,
                direction: this.sort.direction,
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            },
            selectedEvent: this.selectedEvent,
            selectedLogSource: this.selectedLogSource,
            selectedAgentType: this.selectedAgentType,
            table: this.selectedTable,
            searchId: this.selectedId,
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
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
                table: "Log"
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

    filter$ = new Subject();

    applyFilter(filterValue?: string) {
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }

        this.filter$.next();
    }

    viewLogDesc(id, date) {
        const dialog = this.dialog.open(ViewLogDescComponent, {
            data: {
                id: id,
                date: date
            }
        });
    }

}

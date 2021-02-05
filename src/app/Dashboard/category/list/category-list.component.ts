import { Component, OnInit, AfterViewInit, AfterContentInit } from "@angular/core";
import { MatTableDataSource, PageEvent, MatDialog } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { ICategory } from "../category";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IGrade } from "../../grade/grade";
import { finalize } from "rxjs/operators";
import { CategoryComfirmAbsenceModalComponent } from "./category-comfirm-absence-modal/category-comfirm-absence-modal.component";
import { EncryptService } from "src/app/shared/services/encrypt.service";
import { RegisterItemLoginsModalComponent } from "./register-item-logins-modal/register-item-logins-modal.component";

export type RegisterItemPreviewToken = {
    catId: number,
    dateExpire?: any,
    isFromDashboard: boolean
}

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
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<ICategory>;
    selection = new SelectionModel<ICategory>(true, []);

    Category: ICategory[] = [];

    isLoading: boolean;

    isLoadingResults = true;

    txtSearch: string = "";

    itemLength = 0;

    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    // @ViewChild(MatSort, { static: true }) sort: MatSort;
    // @ViewChild("tree", { static: true }) tree: ElementRef;

    // Categories: ICategory[] = [];

    selectedCatId = null;

    TYPE = 0;

    pageTitle = "نمون برگ";
    pageSubTitle = "نمون برگ";
    pageTitles = "نمون برگ ها";
    pageUrl = "category";

    grades: IGrade[] = [];
    courses = [];
    examTypes = [];


    selectedGradeId = null;
    selectedCourseId = null;
    selectedExamTypeId = null;

    archiveType = 1;

    page = 1;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        public auth: AuthService,
        private message: MessageService,
        private dialog: MatDialog,
        private encrypte: EncryptService
    ) {

        this.activeroute.data.subscribe(data => {

            this.TYPE = data["Type"];

            if (this.TYPE == 1) {
                this.pageTitle = "آزمون آنلاین";
                this.pageTitles = "آزمون های آنلاین";
                this.pageUrl = "online-exam";


                this.auth.post("/api/Grade/getAll").subscribe(data => {
                    if (data.success) {
                        this.grades = data.data;
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                });

                this.auth.post("/api/Course/getAll").subscribe(data => {
                    if (data.success) {
                        this.courses = data.data;
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                });

                this.auth.post("/api/ExamType/getAll").subscribe(data => {
                    if (data.success) {
                        this.examTypes = data.data;
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                });
            }

            this.displayedColumns.push(...[
                "select",
                "id",
                "title",
                "parentTitle",
            ]);

            if (this.TYPE == 1) {
                this.displayedColumns.push("grade");
            }

            this.displayedColumns.push(...[
                "pin",
                "action"
            ]);

            // this.auth.post("/api/Category/getAllByType", this.TYPE).subscribe((data: jsondata) => {
            //     if (data.success) {
            //         this.Categories = data.data;
            //     } else {
            //         this.message.showMessageforFalseResult(data);
            //     }
            // });
        });


    }

    getCourseByGrade() {
        let gradeId = this.selectedGradeId;

        if (gradeId) {
            return this.courses.filter(c => c.gradeId == gradeId);
        }

        return [];
    }

    togglePin(id) {
        this.auth.post("/api/Category/togglePin", id).subscribe(data => {
            if (data.success) {
                // this.refreshDataSource();
                this.Category.find(c => c.id == id).isPined = !this.Category.find(c => c.id == id).isPined;
                this.auth.message.showSuccessAlert();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    // onCategorySelectChange() {
    //     if (this.selectedCatId) {
    //         let cat = this.Categories.find(c => c.id == this.selectedCatId);
    //         this.txtSearch = cat.title;
    //         this.refreshDataSource();
    //     } else {
    //         this.txtSearch = "";
    //         this.refreshDataSource();
    //     }
    // }

    showLoginList(id, title) {
        this.dialog.open(RegisterItemLoginsModalComponent, {
            data: {
                catId: id,
                catTitle: title,
            }
        });
    }

    showPreview(catId: number) {
        const tokenObj = {
            catId: catId
        }

        const token = this.encrypte.encryptObject(tokenObj);

        const url = `${this.auth.indexUrl}#/register-item/${catId}?token=${token}`;

        const tab = window.open(url, '_blank');
        tab.focus();
    }

    getCatsByPined(isPined = true) {
        return isPined ? this.Category.filter(c => c.isPined) : this.Category;
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

        return numSelected === this.getRowCanSelected();
    }

    getCurrentDataOfPage(): ICategory[] {
        let List: ICategory[];

        this.dataSource.connect().subscribe(rows => (List = rows));

        return List;
    }

    public resetSelection() {
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
        if (this.auth.isUserAccess(this.TYPE == 0 ? "remove_Category" : "remove_OnlineExam")) {
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

    removeCat(id) {
        if (confirm("آیا از حذف این مورد اطمینان دارید؟")) {
            let cat = this.Category.find(c => c.id == id);
            this.auth.post("/api/Category/Delete", [id], {
                type: 'Delete',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Category',
                logSource: 'dashboard',
                deleteObjects: [cat],
                table: "Category",
                tableObjectIds: [id]
            }).subscribe(data => {
                if (data.success) {
                    this.message.showSuccessAlert();

                    this.Category.splice(this.Category.indexOf(cat), 1);
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

    onEdit(id) {
        if (this.auth.isUserAccess(this.TYPE == 0 ? "edit_Category" : "edit_OnlineExam")) {
            this.router.navigate(["/dashboard/" + this.pageUrl + "/edit/" + id]);
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

    refreshDataSource(clearList = false) {

        this.isLoading = true;

        if (clearList) {
            this.page = 1;
        }

        this.selection.clear();

        let obj = {
            getparams: {
                sort: "",
                direction: "",
                pageIndex: this.page,
                pageSize: 12,
                q: this.txtSearch,
            },
            type: this.TYPE,
            selectedGradeId: this.selectedGradeId,
            selectedCourseId: this.selectedCourseId,
            selectedExamTypeId: this.selectedExamTypeId,
            archiveType: this.archiveType
        };

        this.auth.post("/api/Category/Get", obj, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Category List',
            logSource: 'dashboard',
            object: obj,
            table: "Category"
        }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {

                if (clearList) {
                    this.Category = [];
                }

                this.isLoadingResults = false;
                this.itemLength = +data.type;

                const cats: ICategory[] = data.data;

                cats.forEach(cat => {
                    this.Category.push(cat);
                });
            } else {
                this.isLoadingResults = false;
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }


    canShowMoreButton(): boolean {
        var nowItemCount = this.Category.length;
        var totalItemCount = this.itemLength;

        if (nowItemCount != 0 && nowItemCount < totalItemCount) {
            return true;
        }

        return false;
    }

    nextPage() {
        this.page += 1;

        this.refreshDataSource();
    }

    ngOnInit() {
        // const changeed = merge(this.sort.sortChange, this.paginator.page);

        // changeed.subscribe(() => {
        //     this.refreshDataSource();
        // });


    }

    ngAfterContentInit(): void {

    }

    ngAfterViewInit(): void {
        this.refreshDataSource();
    }

    clearSelection() {
        $("#divtree").jstree("deselect_all");
        this.txtSearch = "";
        this.applyFilter();
    }

    openAllTree() {
        $("#divtree").jstree("open_all");
    }

    closeAllTree() {
    }

    checkForNodeOpen(): boolean {
        if ($("#divtree li.jstree-open").length) {
            return true;
        } else {
            return false;
        }
    }

    applyFilter() {
        this.refreshDataSource(true);
    }

    changeCheckableProperty(catId, type, check) {
        if (this.auth.isUserAccess(this.TYPE == 0 ? "edit_Category" : "edit_OnlineExam")) {

            let obj = {
                catId: catId,
                type: type,
                check: check,
            };

            this.auth.post("/api/Category/ChangeCheckableProperty", obj, {
                type: 'Edit',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Change checkable properties',
                logSource: 'dashboard',
                object: obj,
                oldObject: null,
                table: "Category",
                tableObjectIds: [catId]
            }).subscribe(data => {
                if (data.success) {
                    // this.refreshDataSource(true);

                    let cat = this.Category.find(c => c.id == catId);

                    this.Category.find(c => c.id == catId)[type] = check;
                    if (type == "isArchived") {
                        if (this.archiveType == 1 || this.archiveType == 2) {
                            this.Category.splice(this.Category.indexOf(cat), 1);
                            this.itemLength -= 1;
                        }
                    }
                    this.auth.message.showSuccessAlert();
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

    isLoadingAbsence = false;

    absenceForOnlineExam(catId, catTitle, calculateNegativeScore) {
        if (this.auth.isUserAccess(this.TYPE == 0 ? "edit_Category" : "edit_OnlineExam") && this.TYPE == 1) {

            this.dialog.open(CategoryComfirmAbsenceModalComponent, {
                data: {
                    catId: catId,
                    catTitle: catTitle,
                    calculateNegativeScore: calculateNegativeScore,
                }
            });
        }
    }







}

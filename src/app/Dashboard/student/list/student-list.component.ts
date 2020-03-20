import { Component, ViewChild, OnInit } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog, MatBottomSheet } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { merge } from "rxjs";
import { IStudent, getStudentStateString, getStudentStateColorString } from "../student";
import { RegisterStudentModalComponent } from "../modals/register-student/register-student.component";
import { RegistredListStudentModalComponent } from "../modals/registred-list/registred-list.component";
import { IGrade } from "../../grade/grade";
import { IClass } from "../../class/class";
import { FastEditStudentModalComponent } from "../modals/fast-edit/fast-edit.component";
import { IStudentInfo } from "../studentinfo";
import { StdChangeStateSheetComponent } from "./change-state-sheet/change-state-sheet.component";
import { PrintDataService } from "src/app/shared/components/print-data/print-data.service";
import { ChangeStdPasswordComponent } from "../modals/change-std-password/change-std-password.component";
import { getStdStudyStateString, getStdBehaveStateString, getStdPayrollStateString } from "../stdClassMng";



@Component({
    templateUrl: "./student-list.component.html",
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

            div.panel-body div b {
                color: blue;
            }
        `
    ],
    styleUrls: ["./student-list.component.scss"]
})
export class StudentListComponent implements OnInit {
    displayedColumns: string[] = [
        "select",
        "id",
        "code",
        "namelast",
        "fatherName",
        "idNumber",
        "state",
        "action"
    ];
    dataSource: MatTableDataSource<IStudent>;
    selection = new SelectionModel<IStudent>(true, []);

    Students: IStudent[];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    grades: IGrade[] = [];
    selectedGradeId: number = null;

    classes: IClass[] = [];
    selectedClassId: number = null;

    selectedStudentState: number = null;
    selectedStdStudyState: number = null;
    selectedStdBehaveState: number = null;
    selectedStdPayrollState: number = null;


    selectedStudentList: IStudent[] = [];
    showSelectedStudentList = false;
    selectedStudentdataSource: MatTableDataSource<IStudent>;
    displayedSelectedStudentColumns: string[] = [
        "id",
        "code",
        "namelast",
        "fatherName",
        "idNumber",
        "action"
    ];

    studentDetail: IStudent = new IStudent();
    studentInfoDetail: IStudentInfo = new IStudentInfo();
    showStudentDetail = false;

    parentAccess: "all" | "access" | "block" = "all";

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        public auth: AuthService,
        private message: MessageService,
        private dialog: MatDialog,
        private bottomSheet: MatBottomSheet,
        private printService: PrintDataService
    ) { }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            // if (!row.havePerson) {
            rowCanSelect += 1;
            // }
        });

        return rowCanSelect;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;

        return numSelected === this.getRowCanSelected();
    }

    getCurrentDataOfPage(): IStudent[] {
        let List: IStudent[];

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
                //   if (!row.havePerson) {
                this.selection.select(row);
                //   }
            });
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_Student")) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/Student/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Student',
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
        if (this.auth.isUserAccess("edit_Student")) {
            this.router.navigate(["/dashboard/student/edit/" + id]);
        }
    }


    onFastEdit(row: IStudent) {
        const dialog = this.dialog.open(FastEditStudentModalComponent, {
            data: {
                stdName: row.name + ' ' + row.lastName,
                stdId: row.id,
                student: row
            }
        });

        dialog.afterClosed().subscribe(data => {
            if (data) {
                this.refreshDataSource();
            }
        });
    }

    ViewStudent(row: IStudent) {
        if (this.auth.isUserAccess("view_Student")) {
            this.auth.post("/api/Student/getStudent", row.id, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'View Single Student Detaile in Student List page (Bottom)',
                logSource: 'dashboard',
                object: {
                    student: row
                },
            }).subscribe((data: jsondata) => {
                if (data.success) {
                    this.studentDetail = data.data.student;
                    if (data.data.studentinfo) {
                        this.studentInfoDetail = data.data.studentinfo;
                    }
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });

            this.showStudentDetail = true;

        }

    }

    getClassbyGrade(gradeId) {
        if (gradeId) {
            this.selectedGradeId = gradeId;
            this.refreshDataSource();
            this.auth.post("/api/Class/getClassByGrade", gradeId).subscribe((data: jsondata) => {
                if (data.success) {
                    this.selectedClassId = null;
                    this.classes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
        }
    }

    setSelectedClassId(cid) {
        if (cid != null) {
            this.selectedClassId = cid;
            this.refreshDataSource();
        }
    }

    refreshDataSource() {
        this.selection.clear();

        var obj = {
            getparams: {
                sort: this.sort.active,
                direction: this.sort.direction,
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            },
            classId: this.selectedClassId,
            gradeId: this.selectedGradeId,
            selectedStudentState: this.selectedStudentState,
            selectedStdStudyState: this.selectedStdStudyState,
            selectedStdBehaveState: this.selectedStdBehaveState,
            selectedStdPayrollState: this.selectedStdPayrollState,
            parentAccess: this.parentAccess
        }

        this.auth
            .post("/api/Student/Get", obj, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Student List Get Method',
                logSource: 'dashboard',
                object: obj,
            }).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.isLoadingResults = false;
                        this.itemLength = data.type;
                        this.Students = data.data;

                        this.dataSource = new MatTableDataSource(this.Students);
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


        this.auth.post("/api/Grade/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.grades = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        // this.auth.post("/api/Class/getAll", null).subscribe(
        //     (data: jsondata) => {
        //         if (data.success) {
        //             this.classes = data.data;
        //         } else {
        //             this.message.showMessageforFalseResult(data);
        //         }
        //     },
        //     er => {
        //         this.auth.handlerError(er);
        //     }
        // );
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

    getExcelExample() {
        this.auth.post("/api/Student/getExcelExample", null, {
            type: 'Add',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Download Excel File Example',
            logSource: 'dashboard',
            object: {},
        }).subscribe((data: jsondata) => {
            if (data.success) {
                var win = window.open(
                    this.auth.apiUrl + data.redirect.substr(1),
                    "_blank"
                );
                win.focus();
            } else {
                this.message.showMessageforFalseResult(data);
            }
        })
    }

    handleFileExcelForImport(files: FileList) {
        var fileToUpload = files.item(0);

        if (fileToUpload) {
            let reader = new FileReader();
            reader.readAsDataURL(fileToUpload);
            reader.onload = () => {
                let result = reader.result.toString().split(",")[1];
                this.auth.post("/api/Student/ImportDataFromExcel", {
                    fileValue: result,
                    fileName: fileToUpload.name,
                    fileType: fileToUpload.type
                }, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Import Students from Excel file',
                    logSource: 'dashboard',
                    object: {
                        fileName: fileToUpload.name,
                        fileType: fileToUpload.type
                    },
                }).subscribe((data: jsondata) => {
                    if (data.success) {
                        this.message.showSuccessAlert("رکورد های موجود با موفقیت ثبت شدند");
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                    this.refreshDataSource();
                });

            }


        }
    }

    openChangePasswordDialog(stdId, stdName, type) {
        const dialog = this.dialog.open(ChangeStdPasswordComponent, {
            data: {
                stdId: stdId,
                stdName: stdName,
                type: type
            },
            direction: "rtl"
        });

        dialog.afterClosed().subscribe(data => {

        });
    }

    registerStudent(stdId, stdName) {
        const dialog = this.dialog.open(RegisterStudentModalComponent, {
            data: {
                stdId: stdId,
                stdName: stdName
            }
        });

        dialog.afterClosed().subscribe(data => {
            if (data) {
                this.refreshDataSource();
            }
        });
    }

    showRegisteredList(stdId, stdName) {
        const dialog = this.dialog.open(RegistredListStudentModalComponent, {
            data: {
                stdId: stdId,
                stdName: stdName
            }
        });

        dialog.afterClosed().subscribe(data => {
            this.refreshDataSource();
        });
    }

    clearSearch() {
        this.selectedGradeId = null;
        this.selectedClassId = null;
        this.selectedStudentState = null;
        this.selectedStdStudyState = null;
        this.selectedStdBehaveState = null;
        this.selectedStdPayrollState = null;

        this.refreshDataSource();
    }

    addToSelectedList(row: IStudent) {
        this.showSelectedStudentList = true;
        var std = this.selectedStudentList.find(c => c.id == row.id);

        if (!std) {
            this.selectedStudentList.push(row);
            this.selectedStudentdataSource = new MatTableDataSource(this.selectedStudentList);
        }
    }

    addGroupToSelectedList() {
        this.selection.selected.forEach(row => {
            this.showSelectedStudentList = true;
            var std = this.selectedStudentList.find(c => c.id == row.id);

            if (!std) {
                this.selectedStudentList.push(row);
            }
        });
        this.selection.clear();
        this.selectedStudentdataSource = new MatTableDataSource(this.selectedStudentList);
    }

    isItemExistInSelectedItemList(row: IStudent) {
        var std = this.selectedStudentList.find(c => c.id == row.id);

        if (std) {
            return true;
        }

        return false;
    }

    closeSelectedList() {
        this.showSelectedStudentList = false;
        this.selectedStudentList = [];
    }

    deleteSelectedListRow(row: IStudent) {
        var std = this.selectedStudentList.find(c => c.id == row.id);

        if (std) {
            this.selectedStudentList.splice(this.selectedStudentList.indexOf(std), 1);
            this.selectedStudentdataSource = new MatTableDataSource(this.selectedStudentList);
            if (this.selectedStudentList.length == 0) {
                this.showSelectedStudentList = false;
            }
        }
    }

    groupRegisteration() {

        var ids: number[] = [];
        this.selectedStudentList.forEach(row => {
            ids.push(row.id);
        });

        const dialog = this.dialog.open(RegisterStudentModalComponent, {
            data: {
                registerGroup: true,
                ids: ids,
                stdName: "دانش آموزان انتخاب شده",
                stdId: 0
            }
        });

        dialog.afterClosed().subscribe(data => {
            if (data) {
                this.refreshDataSource();
                this.selectedStudentList = [];
                this.showSelectedStudentList = false;
            }
        });
    }

    setState(state) {
        var ids: number[] = [];
        this.selectedStudentList.forEach(row => {
            ids.push(row.id);
        });

        this.auth.post("/api/Student/setState", {
            ids: ids,
            state: state
        }, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Set Students State Group',
            logSource: 'dashboard',
            object: {
                ids: ids,
                state: state
            },
        }).subscribe((data: jsondata) => {
            if (data.success) {
                this.message.showSuccessAlert();
                this.refreshDataSource();
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        })
    }

    openStdChangeStateSheet(id, nowState) {
        const bottomSheet = this.bottomSheet.open(StdChangeStateSheetComponent, {
            data: {
                Id: id,
                nowState: nowState,
                type: 0
            }
        });

        bottomSheet.afterDismissed().subscribe(data => {
            if (data) {
                this.refreshDataSource();
            }
        })
    }

    getExcelFileOfList() {
    }


    printData() {
        this.auth.post("/api/Student/getPrintData", null, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Print Student List',
            logSource: 'dashboard',
            object: null,
        }).subscribe(data => {
            if (data.success) {

                this.printService.setPrintDatasAndRedirect(data, this.router.url);

            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    toggleAccessByType(stdId, type, event) {
        var access: boolean = event.checked;

        this.auth.post("/api/Student/ChangeAccessByType", {
            stdId: stdId,
            type: type,
            access: access,
        }, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Change Student(1)/ParentStudent(2) Access Single',
            logSource: 'dashboard',
            object: {
                stdId: stdId,
                type: type,
                access: access,
            },
            oldObject: null
        }).subscribe(data => {
            if (data.success) {
                this.refreshDataSource();
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }


    getStdStudyStateString(state) {
        return getStdStudyStateString(state);
    }

    getStdBehaveStateString(state) {
        return getStdBehaveStateString(state);
    }

    getStdPayrollStateString(state) {
        return getStdPayrollStateString(state);
    }

    getStudentStateString(state) {
        return getStudentStateString(state);
    }
    getStudentStateColorString(state) {
        return getStudentStateColorString(state);
    }

    resetPassword(type: 1 | 2) {
        var ids: number[] = [];
        this.selectedStudentList.forEach(row => {
            ids.push(row.id);
        });

        this.auth.post("/api/Student/ResetPasswordGroup", {
            ids: ids,
            type: type
        }, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Reset Student(1)/ParentStudent(2) Password(Set password to 1) Group (Student List)',
            logSource: 'dashboard',
            object: {
                ids: ids,
                type: type
            },
            oldObject: null
        }).subscribe(data => {
            if (data.success) {
                this.refreshDataSource();
                this.message.showSuccessAlert();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    changeAccess(type: 1 | 2, haveAccess: boolean) {
        var ids: number[] = [];
        this.selectedStudentList.forEach(row => {
            ids.push(row.id);
        });

        this.auth.post("/api/Student/ChangeAccessGroup", {
            ids: ids,
            type: type,
            access: haveAccess
        }, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Change Student(1)/ParentStudent(2) Access Group (Student List)',
            logSource: 'dashboard',
            object: {
                ids: ids,
                type: type,
                access: haveAccess
            },
            oldObject: null
        }).subscribe(data => {
            if (data.success) {
                this.refreshDataSource();
                this.message.showSuccessAlert();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }
}
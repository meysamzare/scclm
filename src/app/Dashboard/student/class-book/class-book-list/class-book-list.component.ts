import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { IClassBook, getClassBookTypeString, getClassBookResult } from '../class-book';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge } from 'rxjs';
import { IGrade } from 'src/app/Dashboard/grade/grade';
import { IClass } from 'src/app/Dashboard/class/class';
import { IStudent } from '../../student';
import { ICourse } from 'src/app/Dashboard/course/course';
import { ITeacher } from 'src/app/Dashboard/teacher/teacher';

@Component({
    selector: 'app-class-book-list',
    templateUrl: './class-book-list.component.html',
    styleUrls: ['./class-book-list.component.scss']
})
export class ClassBookListComponent implements OnInit {
    displayedColumns: string[] = [
        "select",
        "date",
        "name",
        "class",
        "course",
        "teacher",
        "type",
        "value",
        "action"
    ];
    dataSource: MatTableDataSource<IClassBook>;
    selection = new SelectionModel<IClassBook>(true, []);

    PAGE_Datas: IClassBook[] = [];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;

    PAGE_TITLE = " دفتر کلاسی ";
    PAGE_TITLES = " دفاتر کلاسی ";
    PAGE_APIURL = "ClassBook";
    PAGE_URL = "student/class-book";
    PAGE_ROLE = "ClassBook";

    grades: IGrade[] = [];
    selectedGrade: number = null;

    classes: IClass[] = [];
    selectedClass: number = null;

    students: IStudent[] = [];
    selectedStudent: number = null;

    courses: ICourse[] = [];
    selectedCourse: number = null;

    teachers: ITeacher[] = [];
    selectedTeacher: number = null;


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    filtredType: "all" | "P_A" | "ExamScore" | "ClassAsk" | "Point" | "Discipline" = "all";

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService
    ) {
        this.auth.post("/api/Student/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.students = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
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
        this.auth.post("/api/Class/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.classes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/Teacher/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.teachers = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/Course/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.courses = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            // if (!row.haveStudent) {
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

    getCurrentDataOfPage(): IClassBook[] {
        let List: IClassBook[];

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
                // if (!row.haveStudent) {
                this.selection.select(row);
                // }
            });
    }


    getClassBookTypeString(type) {
        return getClassBookTypeString(type);
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
                    tableName: 'ClassBook',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: this.PAGE_APIURL,
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
        if (this.auth.isUserAccess("edit_" + this.PAGE_ROLE)) {
            this.router.navigate(["/dashboard/" + this.PAGE_URL + "/edit/" + id]);
        }
    }

    clearFilters() {
        this.selectedGrade = null;
        this.selectedClass = null;
        this.selectedStudent = null;
        this.selectedCourse = null;
        this.selectedTeacher = null;

        this.refreshDataSource();
    }


    getFiltredCourse() {
        if (this.selectedTeacher) {
            return this.courses.filter(c => c.teacherId == this.selectedTeacher);
        }

        return this.courses;
    }

    getFiltredClass() {
        if (this.selectedGrade) {
            return this.classes.filter(c => c.gradeId == this.selectedGrade);
        }

        return this.classes;
    }


    getClassBookResult(type, value, examName) {
        return getClassBookResult(type, value, examName);
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
            selectedGrade: this.selectedGrade,
            selectedClass: this.selectedClass,
            selectedStudent: this.selectedStudent,
            selectedCourse: this.selectedCourse,
            selectedTeacher: this.selectedTeacher,
            filtredType: this.filtredType
        }

        this.auth.post("/api/" + this.PAGE_APIURL + "/Get", obj, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'ClassBook List',
            logSource: 'dashboard',
            object: obj,
            table: this.PAGE_APIURL
        }).subscribe(
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

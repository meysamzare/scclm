import { Component, OnInit, Inject, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IUser } from 'src/app/Dashboard/user/user';
import { IStudent } from 'src/app/Dashboard/student/student';
import { TicketType } from '../../../ticket';
import { ITeacher } from 'src/app/Dashboard/teacher/teacher';
import { IGrade } from 'src/app/Dashboard/grade/grade';
import { IClass } from 'src/app/Dashboard/class/class';

@Component({
    selector: 'app-select-reciver-user-modal',
    templateUrl: './select-reciver-user-modal.component.html',
    styleUrls: ['./select-reciver-user-modal.component.scss']
})
export class SelectReciverUserModalComponent implements OnInit, AfterViewInit {

    Users: IUser[] = [];
    Students: IStudent[] = [];
    Teachers: ITeacher[] = [];

    Type: TicketType = TicketType.Student;

    search = "";

    Title = "";

    grades: IGrade[] = [];
    classes: IClass[] = [];
    selectedGrade: number = null;
    selectedClass: number = null;

    constructor(
        public dialogRef: MatDialogRef<SelectReciverUserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private componentFactoryResolver: ComponentFactoryResolver,
    ) { 
        this.Type = this.data.type;
    }

    ngAfterViewInit(): void {
        Promise.resolve(null).then(() => {
            if (this.Type == 0 || this.Type == 1) {
                this.getAllGrades();
                this.refreshStudents();
            } else if (this.Type == 2) {
                this.getAllUser();
            } else {
                this.getAllTeachers();
            }
    
            this.Title = this.getModalTitle();
        });
    }

    ngOnInit() {
        
    }

    getAllUser() {
        this.auth.post("/api/User/getAll").subscribe(data => {
            if (data.success) {
                this.Users = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    refreshStudents() {
        this.auth.post("/api/Student/GetByGradeClass", {
            search: this.search,
            gradeId: this.selectedGrade,
            classId: this.selectedClass,
        }).subscribe(data => {
            if (data.success) {
                this.Students = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }
    
    clearGradeAndClass() {
        this.selectedClass = null;
        this.selectedGrade = null;

        this.refreshStudents();
    }

    getAllGrades() {
        this.auth.post("/api/Grade/getAll").subscribe(data => {
            if (data.success) {
                this.grades = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    
    onGradeSelected() {
        this.refreshStudents();

        if (this.selectedGrade) {
            this.auth.post("/api/Class/getClassByGrade", this.selectedGrade).subscribe(data => {
                if (data.success) {
                    this.classes = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }

    }


    getAllTeachers() {
        this.auth.post("/api/Teacher/getAll").subscribe(data => {
            if (data.success) {
                this.Teachers = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    getFiltredUsers() {
        if (this.search) {
            return this.Users.filter(c => c.fullName.includes(this.search))
        }

        return this.Users;
    }

    getFiltredTeachers() {
        if (this.search) {
            return this.Teachers.filter(c => c.name.includes(this.search))
        }

        return this.Teachers;
    }

    getModalTitle(): string {
        var title = "انتخاب ";

        var type = this.Type;

        if (type == 0) {
            title = title + "دانش آموز";
        }

        if (type == 1) {
            title = title + "اولیای دانش آموز";
        }

        if (type == 2) {
            title = title + "کاربر";
        }

        if (type == 3) {
            title = title + "دبیر";
        }

        return title;
    }

    returnSelectedItem(id, name) {
        this.dialogRef.close({
            id: id,
            name: name
        });
    }

}

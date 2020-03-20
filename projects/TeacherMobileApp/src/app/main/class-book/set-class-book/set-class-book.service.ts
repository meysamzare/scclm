import { Injectable } from '@angular/core';
import { ClassBookType } from 'src/app/Dashboard/student/class-book/class-book';
import { IStudent } from 'src/app/Dashboard/student/student';

@Injectable({
    providedIn: 'root'
})
export class SetClassBookService {

    studentId: number;
    studentName: string;
    insTituteId: number;
    yeareducationId: number;
    gradeId: number;
    classId: number;
    courseId: number;
    teacherId: number;
    type: ClassBookType;

    forAllStudent = false;
    students: IStudent[] = [];

    constructor() { }

    setData(
        insTituteId: number,
        yeareducationId: number,
        gradeId: number,
        classId: number,
        courseId: number,
        teacherId: number,
        type: ClassBookType,
        studentId: number = null,
        studentName: string = null,
        forAllStudent = false,
        students: IStudent[] = []
    ) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.insTituteId = insTituteId;
        this.yeareducationId = yeareducationId;
        this.gradeId = gradeId;
        this.classId = classId;
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.type = type;

        this.forAllStudent = forAllStudent;
        this.students = students;
    }

    haveAnyData(): boolean {
        if (
            this.insTituteId &&
            this.yeareducationId &&
            this.gradeId &&
            this.classId &&
            this.courseId &&
            this.teacherId &&
            this.type != null
        ) {
            return true;
        } else {
            return false;
        }
    }
}

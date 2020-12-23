import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IStudent } from 'src/app/Dashboard/student/student';
import { IStudentInfo } from 'src/app/Dashboard/student/studentinfo';
import { jsondata } from 'src/app/shared/Auth/auth.service';
import { StudentAuthService } from '../../service/parent-student-auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-complate-student-info',
    templateUrl: './complate-student-info.component.html',
    styleUrls: ['./complate-student-info.component.scss']
})
export class ComplateStudentInfoComponent implements OnInit {

    StudentFormGroup: FormGroup;
    StudentFatherFormGroup: FormGroup;
    StudentMomFormGroup: FormGroup;
    StudentFamilyFormGroup: FormGroup;

    student: IStudent = new IStudent();
    studentInfo: IStudentInfo = new IStudentInfo();

    constructor(
        private formBuilder: FormBuilder,
        private stdAuth: StudentAuthService,
        private router: Router
    ) { }

    ngOnInit() {

        if (this.stdAuth.getStudent().isStudentInfoComplated) {
            this.router.navigateByUrl("/");
        }

        var std = this.stdAuth.getStudent();
        this.student.id = std.id;

        this.student.idNumber = std.idNumber;
        this.student.idNumber2 = std.idNumber2;
        this.student.code = std.code;
        this.student.orgCode = std.orgCode;


        this.StudentFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            fatherName: ['', Validators.required],
            birthDate: ['', Validators.required],
            idCardSerial: ['', Validators.required],
            birthLocation: ['', Validators.required],
        });

        this.StudentFatherFormGroup = this.formBuilder.group({
            fatherName: ['', Validators.required],
            fatherEdu: ['', Validators.required],
            fatherJob: ['', Validators.required],
            fatherPhone: ['', Validators.required],
            fatherJobPhone: ['', Validators.required],
            fatherJobAddress: ['', Validators.required]
        });

        this.StudentMomFormGroup = this.formBuilder.group({
            momName: ['', Validators.required],
            momEdu: ['', Validators.required],
            momJob: ['', Validators.required],
            momJobPhone: ['', Validators.required],
            momPhone: ['', Validators.required],
            momJobAddress: ['', Validators.required]
        });

        this.StudentFamilyFormGroup = this.formBuilder.group({
            homeAddress: ['', Validators.required],
            homePhone: ['', Validators.required],
            familyState: ['', Validators.required],
            religion: ['', Validators.required],
            socialNet: ['', Validators.required],
            email: ['', Validators.required],
            desc: ['', Validators.required]
        });
    }


    openc(picker) {
        picker.open();
    }


    finish() {

        var std = this.stdAuth.getStudent();
        this.student.id = std.id;

        this.student.idNumber = std.idNumber;
        this.student.idNumber2 = std.idNumber2;
        this.student.code = std.code;
        this.student.orgCode = std.orgCode;

        this.student.name = std.name;
        this.student.lastName = std.lastName;


        this.stdAuth.auth.post("/api/Student/Edit", {
            student: this.student,
            studentInfo: this.studentInfo
        }, {
            type: 'Edit',
            agentId: this.stdAuth.getStudent().id,
            agentType: 'StudentParent',
            agentName: this.stdAuth.getStudentFullName(),
            tableName: 'Complate Student Informations',
            logSource: 'PMA',
            object: {
                student: this.student,
                studentInfo: this.studentInfo
            },
            oldObject: "NotAvalable!!"
        }).subscribe((data: jsondata) => {
            if (data.success) {
                this.stdAuth.auth.message.showSuccessAlert("با تشکر از شما بابت تکمیل اطلاعات فرزند خود، اطلاعات با موفقیت در پایگاه داده ما ثبت شد");
                
                var student = this.stdAuth.getStudent() as any;

                student.isStudentInfoComplated = true;

                this.stdAuth.setStudent(student);

                this.router.navigateByUrl("/");
            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        });

    }


}

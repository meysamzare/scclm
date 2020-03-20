import { Component, OnInit, OnDestroy } from "@angular/core";
import { ReCaptchaV3Service } from "ngx-captcha";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "../shared/services/message.service";
import { AuthService, jsondata } from "../shared/Auth/auth.service";
import { IWorkBookHeader } from "./workbookheader";
import { IWorkBookDetail } from "./workbookdetail";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IStudent } from "../Dashboard/student/student";
import { IStudentInfo } from "../Dashboard/student/studentinfo";


@Component({
    templateUrl: "./student-workbook.component.html",
    styleUrls: ["./student-workbook.component.scss"],
    styles: [`
        .tabletd {
            border: 1px solid rgb(132, 164, 175)
        }
    `]
})
export class StudentWorkBookComponent implements OnInit, OnDestroy {


    studentId = 0;
    tk = "";

    nobat1Avg = 0;
    nobat2Avg = 0;

    stdWorkBookHeader: IWorkBookHeader = new IWorkBookHeader();
    stdWorkBookDetails: IWorkBookDetail[] = [];

    selectedForRequest: number[] = [];

    isInRegister = false;
    isRegisterSuccessfull = false;

    StudentFormGroup: FormGroup;
    StudentFatherFormGroup: FormGroup;
    StudentMomFormGroup: FormGroup;
    StudentFamilyFormGroup: FormGroup;

    student: IStudent = new IStudent();
    studentInfo: IStudentInfo = new IStudentInfo();

    studentServer: IStudent = new IStudent();

    constructor(
        private reCaptchaV3Service: ReCaptchaV3Service,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService,
        private formBuilder: FormBuilder
    ) {
        this.activeRoute.params.subscribe(params => {
            this.studentId = params["stdId"];
        });
    }

    ngOnInit(): void {

        this.tk = localStorage.getItem("tsk");

        if (!this.tk) {
            this.router.navigateByUrl("/");
        }

        this.auth.postToken("/api/Student/stdWB", this.tk, this.studentId)
            .subscribe((data: jsondata) => {
                if (data.success) {
                    if (data.data.stdHeader) {
                        this.stdWorkBookHeader = data.data.stdHeader;
                    }
                    if (this.stdWorkBookHeader.state != 4) {
                        this.stdWorkBookDetails = data.data.stdDt;

                        this.stdWorkBookDetails.filter(c => c.haveRequestToReview).forEach(detail => {
                            this.selectedForRequest.push(detail.id);
                        });

                        this.setNobat1Avg();
                        this.setNobat2Avg();
                    }
                } else {
                    this.message.showMessageforFalseResult(data)
                    this.router.navigateByUrl("/");
                }
            }, er => {
                this.router.navigateByUrl("/");
            });

        this.auth.postToken("/api/Student/getStudent", this.tk, this.studentId)
            .subscribe((data: jsondata) => {
                if (data.success) {
                    this.studentServer = data.data.student;


                    this.student.id = this.studentId;

                    this.student.idNumber = this.studentServer.idNumber;
                    this.student.idNumber2 = this.studentServer.idNumber2;
                    this.student.code = this.studentServer.code;
                    this.student.orgCode = this.studentServer.orgCode;

                    this.studentInfo.desc = "ندارد";
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });


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

    finish() {

        this.auth.postToken("/api/Student/Edit", this.tk, {
            student: this.student,
            studentInfo: this.studentInfo
        }).subscribe((data: jsondata) => {
            if (data.success) {
                this.message.showSuccessAlert("اطلاعات شما با موفقیت ثبت شد");
                this.isInRegister = false;
                this.isRegisterSuccessfull = true;
                this.studentServer.isStudentInfoComplated = true;
                window.scroll(0, 0);
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        })

    }

    print() {
        const printContent = document.getElementById("prt");
        const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
        WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="styles.scss">');
        WindowPrt.document.write(printContent.innerHTML);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    }

    isSelectedForRequest(id) {
        return this.selectedForRequest.some(c => c == id);
    }

    toggleSelection(id) {
        if (this.isSelectedForRequest(id)) {
            this.selectedForRequest.splice(this.selectedForRequest.indexOf(id), 1);
        } else {
            this.selectedForRequest.push(id);
        }
    }

    isShowBtnRequest(): boolean {
        var countSelected = this.selectedForRequest.length;
        var countWasRequested = this.stdWorkBookDetails.filter(c => c.haveRequestToReview == true).length;

        if (countSelected == countWasRequested) {
            return false;
        }

        return true;
    }

    openc(picker) {
        picker.open();
    }

    setRequested() {
        this.auth.postToken("/api/Student/setReviweRequest", this.tk, this.selectedForRequest)
            .subscribe((data: jsondata) => {
                if (data.success) {
                    this.selectedForRequest.forEach(id => {
                        var det = this.stdWorkBookDetails.find(c => c.id == id);
                        det.haveRequestToReview = true;
                    });

                    this.message.showSuccessAlert("درخواست اعتراض شما با موفقیت ثبت شد");
                } else {
                    this.message.showErrorAlert("در هنگام ثبت نمره خطایی روی داده است");
                }
            }, er => {
                this.auth.handlerError(er);
            });
    }

    setNobat1Avg() {
        var totalCountDetail = this.stdWorkBookDetails.length;
        var sum = 0;

        this.stdWorkBookDetails.forEach(det => {
            sum += +det.colExam12;
        });

        this.nobat1Avg = +(sum / totalCountDetail).toFixed(2);
    }

    setNobat2Avg() {
        var totalCountDetail = this.stdWorkBookDetails.length;
        var sum = 0;

        this.stdWorkBookDetails.forEach(det => {
            sum += +det.colExam34;
        });

        this.nobat2Avg = +(sum / totalCountDetail).toFixed(2);
    }




    ngOnDestroy(): void {
        localStorage.removeItem("tsk");
    }



    exit() {
        localStorage.removeItem("tsk");

        this.router.navigateByUrl("/");
    }


}
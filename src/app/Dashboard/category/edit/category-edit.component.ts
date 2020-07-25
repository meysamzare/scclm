import { Component, ViewChild, OnInit, AfterViewInit, AfterViewChecked } from "@angular/core";
import { jsondata, AuthService } from "src/app/shared/Auth/auth.service";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { ICategory } from "../category";
import { DomSanitizer } from "@angular/platform-browser";
import { RoleClass } from "../../role/role";
import { getPostTypeString } from "../../WebSiteManagment/post/post";
import { IAttr } from "../../attribute/attribute";
import { IUnit } from "../../unit/unit";
import Swal from "sweetalert2";
import { IAttributeOption } from "../../attribute/attribute-option";
import { IGrade } from "../../grade/grade";
import { IClass } from "../../class/class";
import { ICourse } from "../../course/course";
import { finalize } from "rxjs/operators";
import { IQuestionOption } from "../../Question/questionoption/questionoption";
import { ITeacher } from "../../teacher/teacher";
import { IExamType } from "../../Exam/examtype/examtype";
import { IWorkbook } from "../../workbook/workbook";
import { PictureSelectModalComponent } from "src/app/html-tools/picture-select-modal/picture-select-modal.component";
import { MatDialog } from "@angular/material";
import { AddTemplateAttributeModalComponent } from "./modals/add-template-attribute-modal/add-template-attribute-modal.component";
import { AddQuestionModalComponent } from "./modals/add-question-modal/add-question-modal.component";
import { AddGroupQuestionModalComponent } from "./modals/add-group-question-modal/add-group-question-modal.component";

declare var $: any;
// import * as $ from 'jquery';

@Component({
    templateUrl: "./category-edit.component.html",
    styles: [
        `
            .example-radio-group {
                display: flex;
                flex-direction: column;
                margin: 15px 0;
            }

            .example-radio-button {
                margin: 5px;
            }

            .radio-group {
                display: flex;
                flex-direction: column;
            }

            .radio-button {
                margin: 0;
            }
        `
    ]
})
export class CategoryEditComponent implements OnInit, AfterViewInit, AfterViewChecked {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    category: ICategory;

    oldData = null;

    catTree: string;

    parsedHtml;

    roles: RoleClass[] = [];


    units: IUnit[] = [];

    attributes: IAttr[] = [];
    isLoading = false;


    @ViewChild("fm1", { static: false }) public fm1: NgForm;
    @ViewChild("d1", { static: false }) public d1;
    @ViewChild("d2", { static: false }) public d2;
    @ViewChild("d3", { static: false }) public d3;

    Categories: ICategory[] = [];

    grades: IGrade[] = [];
    classes: IClass[] = [];

    TYPE = 0;

    pageTitle = "نمون برگ";
    pageTitles = "نمون برگ ها";
    pageUrl = "category";

    courses: ICourse[] = [];
    selectedCourseForQuestion: number = null;
    hardQuestionNumber: number = null;
    mediumQuestionNumber: number = null;
    easyQuestionNumber: number = null;
    isLoadingQuestions = false;

    selectedGradeForCourse = null;

    Teachers: ITeacher[] = [];
    selectedTeacherId = null;

    examTypes: IExamType[] = [];
    workbooks: IWorkbook[] = [];

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService,
        private dialog: MatDialog
    ) {
        this.activeRoute.params.subscribe(params => {

            this.activeRoute.data.subscribe(data => {
                this.category = data.cat;

                this.oldData = JSON.stringify(data.cat);

                if (!this.category.registerFileData) {
                    this.category.registerFileData = "";
                }

                if (!this.category.teachersIdAccess) {
                    this.category.teachersIdAccess = [];
                }

                if (!this.category.showInfoFileData) {
                    this.category.showInfoFileData = "";
                }

                if (!this.category.headerPicData) {
                    this.category.headerPicData = "";
                }

                this.TYPE = data["Type"];

                this.category.type = this.TYPE;

                if (this.TYPE == 1) {
                    this.pageTitle = "آزمون آنلاین";
                    this.pageTitles = "آزمون های آنلاین";
                    this.pageUrl = "online-exam";

                    this.auth.post("/api/Grade/getAll", null).subscribe(data => {
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
                    });
                    this.auth.post("/api/ExamType/getAll").subscribe(data => {
                        if (data.success) {
                            this.examTypes = data.data;
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    });

                    this.auth.post("/api/Workbook/getAll").subscribe(data => {
                        if (data.success) {
                            this.workbooks = data.data;
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    });

                    this.getClassbyGrade();
                }

                this.auth.post("/api/Category/getAllByType", this.TYPE).subscribe((data: jsondata) => {
                    if (data.success) {
                        this.Categories = data.data;
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                });
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = `افزودن ${this.pageTitle}`;
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title =
                        `ویرایش ${this.pageTitle} ${this.category.title}`;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }

            this.auth.post("/api/Role/GetAll").subscribe((data: jsondata) => {
                if (data.success) {
                    this.roles = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });

            this.auth.post("/api/Teacher/getAll").subscribe((data: jsondata) => {
                if (data.success) {
                    this.Teachers = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
        });
    }

    addRandomQuestions() {
        this.isLoadingQuestions = true;

        this.auth.post("/api/Category/AddRandomQuestionAttribute", {
            catId: this.category.id,
            selectedCourseForQuestion: this.selectedCourseForQuestion,
            hardQuestionNumber: this.hardQuestionNumber,
            mediumQuestionNumber: this.mediumQuestionNumber,
            easyQuestionNumber: this.easyQuestionNumber,
        }).pipe(
            finalize(() => this.isLoadingQuestions = false)
        ).subscribe(data => {
            if (data.success) {
                this.auth.message.showSuccessAlert();
                this.auth.message.showInfoAlert("لطفا توجه داشته باشید که نمره سوالات به صورت پیشفرض 1 درنظر گرفته شده است");
                this.refreshAttributes();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    openc(picker1) {
        picker1.open();
    }

    addTeacherToCategoryAccess() {
        if (this.selectedTeacherId) {
            let exist = this.category.teachersIdAccess.find(c => c == this.selectedTeacherId);

            if (!exist) {
                this.category.teachersIdAccess.push(this.selectedTeacherId);
                this.selectedTeacherId = null;
            } else {
                this.selectedTeacherId = null;
            }
        }
    }

    getTeacherName(teacherId) {
        let teacher = this.Teachers.find(c => c.id == teacherId);

        if (teacher) {
            return teacher.name;
        }

        return "";
    }

    removeTeacher(teacherId) {
        let exist = this.category.teachersIdAccess.find(c => c == teacherId);

        if (exist) {
            this.category.teachersIdAccess.splice(this.category.teachersIdAccess.indexOf(exist), 1);
        }
    }


    getClassbyGrade() {
        let gradeId = this.category.gradeId;

        if (gradeId) {
            this.auth.post("/api/Class/getClassByGrade", gradeId).subscribe((data: jsondata) => {
                if (data.success) {
                    this.category.classId = null;
                    this.classes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
        } else {
            this.category.classId = null;
        }
    }


    getShiftedItem(attr: IAttr) {
        let options: IAttributeOption[] = (attr as any).attributeOptions || [];

        return options;
    }

    getAttrsForUnit(unitId): any[] {
        return this.attributes.filter(c => c.unitId == unitId);
    }

    setIsTrueQuestionOption(option, questionId) {

        option.questionId = questionId;
        option.isTrue = false;

        this.auth.post("/api/Question/SetTrueOption", option).subscribe(data => {
            if (data.success) {
                this.message.showSuccessAlert("با موفقیت ثبت شد");
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    setIsTrueAttributeOption(option: IAttributeOption) {
        option.isTrue = false;

        this.auth.post("/api/Attribute/setTrueOption", option, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Set Attribute True Option',
            logSource: 'dashboard',
            object: option,
            oldObject: option,
            table: "AttributeOption",
            tableObjectIds: [option.id]
        }).subscribe(data => {
            if (data.success) {
                this.message.showSuccessAlert("با موفقیت ثبت شد");
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    changeCheckableAttr(checked: boolean, attr: IAttr, type: string) {
        this.auth.post("/api/Attribute/ChangeCheckable", {
            attrId: attr.id,
            type: type,
            check: checked
        }).subscribe(data => {
            if (data.success) {
                this.attributes.find(c => c == attr)[type] = checked;
                this.auth.message.showSuccessAlert();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    getCourseByCatGrade() {
        let gradeId = this.category.gradeId;

        if (gradeId) {
            return this.courses.filter(c => c.gradeId == gradeId);
        }

        return [];
    }

    getCourseByGrade() {
        let gradeId = this.selectedGradeForCourse;

        if (gradeId) {
            return this.courses.filter(c => c.gradeId == gradeId);
        }

        return [];
    }

    async deleteAttr(id) {
        if (this.auth.isUserAccess(this.TYPE == 0 ? "remove_Attribute" : "remove_OnlineExamOption")) {

            let swalResult = await Swal.fire({
                title: "آیا اطمینان دارید؟",
                text: "حذف کردن این موارد قابل بازگشت نمی باشد",
                icon: "question",
                showCancelButton: true,
                cancelButtonText: "خیر",
                confirmButtonText: "بله"
            });

            if (swalResult.value) {
                let ids: number[] = [id];

                let attr = this.attributes.find(c => c.id == id);

                let deleteDatas = [attr];

                this.auth.post("/api/Attribute/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Attribute From Category Edit',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: "Attribute",
                    tableObjectIds: ids
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert(
                                "مورد انتخابی با موفقیت حذف شد"
                            );

                            this.attributes.splice(this.attributes.indexOf(attr), 1);
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

    editAttr(id) {
        if (this.auth.isUserAccess(this.TYPE == 0 ? "edit_Attribute" : "edit_OnlineExamOption")) {
            this.route.navigateByUrl(`/dashboard/${this.TYPE == 0 ? "attribute" : "online-exam/option"}/edit/${id}`);
        }
    }


    ngOnDestroy(): void {
        let title = "category";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.category)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    ngOnInit(): void {
        if (this.isEdit) {
            this.auth.post("/api/Unit/GetAll").subscribe(data => {
                if (data.success) {
                    this.units = data.data;

                    this.refreshAttributes();

                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
        }


    }

    refreshAttributes() {
        this.auth.post("/api/Attribute/getAttrsForCat", this.activeRoute.snapshot.params["id"]).subscribe(data => {
            if (data.success) {
                this.attributes = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    ngAfterViewChecked(): void {

    }


    ngAfterViewInit(): void {

    }

    setPic(files: File[], type) {

        files.forEach(file => {
            if (file.size / 1024 / 1024 > 5) {
                if (type == 1) {
                    this.d1.reset();
                } else {
                    this.d2.reset();
                }
                return this.message.showWarningAlert(
                    "حجم فایل باید کمتر از " + " پنج مگابایت " + " باشد",
                    "اخطار"
                );
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: ProgressEvent) => {
                let result = reader.result.toString().split(",")[1];

                // RegisterPic
                if (type == 1) {
                    this.category.registerFileData = result;
                    this.category.registerFileName = file.name;
                } else if (type == 2) {
                    this.category.showInfoFileData = result;
                    this.category.showInfoFileName = file.name;
                } else if (type == 3) {
                    this.category.headerPicData = result;
                    this.category.headerPicName = file.name;
                }
            };
        });
    }

    removePic(type) {
        // RegisterPic
        if (type == 1) {
            this.d1.reset();
            this.category.registerFileData = "";
            this.category.registerFileName = "";
        } else if (type == 2) {
            this.d2.reset();
            this.category.showInfoFileData = "";
            this.category.showInfoFileName = "";
        } else if (type == 3) {
            this.d3.reset();
            this.category.headerPicData = "";
            this.category.headerPicName = "";
        }
    }


    getPostTypeString(type) {
        return getPostTypeString(type);
    }

    getFileUrl(url): string {
        return this.auth.apiUrl + url.substr(1);
    }


    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/Category/Edit", this.category, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Edit Category',
                    logSource: 'dashboard',
                    object: this.category,
                    oldObject: JSON.parse(this.oldData),
                    table: "Category",
                    tableObjectIds: [this.category.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate([`/dashboard/${this.pageUrl}`]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Category/Add", this.category, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Add Category',
                    logSource: 'dashboard',
                    object: this.category,
                    table: "Category",
                    tableObjectIds: [this.category.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate([`/dashboard/${this.pageUrl}`]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            }
        } else {
            this.message.showWarningAlert("مقادیر خواسته شده را تکمیل نمایید");
        }
    }

    insertPicture(type: "Desc" | "License") {
        const dialog = this.dialog.open(PictureSelectModalComponent);

        dialog.afterClosed().subscribe(content => {
            if (content) {
                if (type == "Desc") {
                    this.category.desc += content
                }
                if (type == "License") {
                    this.category.license += content
                }
            }
        });
    }

    addTemplateAttribute() {
        const dialog = this.dialog.open(AddTemplateAttributeModalComponent, {
            data: {
                catId: this.category.id
            }
        });

        dialog.afterClosed().subscribe(result => {
            this.refreshAttributes();
        });
    }

    addQuestion() {
        const dialog = this.dialog.open(AddQuestionModalComponent, {
            data: {
                catId: this.category.id
            }
        });

        dialog.afterClosed().subscribe(result => {
            this.refreshAttributes();
        });
    }

    addGroupQuestions() {
        const dialog = this.dialog.open(AddGroupQuestionModalComponent, {
            data: {
                catId: this.category.id
            }
        });

        dialog.afterClosed().subscribe(result => {
            if (result) {
                this.refreshAttributes();
            }
        });
    }

}

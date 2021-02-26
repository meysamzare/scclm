import { Component, ViewChild, OnInit, AfterViewInit, AfterViewChecked, ViewEncapsulation } from "@angular/core";
import { jsondata, AuthService } from "src/app/shared/Auth/auth.service";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { CategoryRegisterItemStepType, ICategory } from "../category";
import { DomSanitizer } from "@angular/platform-browser";
import { RoleClass } from "../../role/role";
import { getPostTypeString } from "../../WebSiteManagment/post/post";
import { getAttributeTypeIcon, getAttributeTypeString, IAttr } from "../../attribute/attribute";
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
import { MatFabMenu } from "@angular-material-extensions/fab-menu";
import { QuickAddAttributeModalComponent } from "./modals/quick-add-attribute-modal/quick-add-attribute-modal.component";
import { AttributeChartDataModalComponent } from "./modals/attribute-chart-data-modal/attribute-chart-data-modal.component";

@Component({
    templateUrl: "./category-edit.component.html",
    encapsulation: ViewEncapsulation.None,
    styleUrls: ["./category-edit.component.scss"]
})
export class CategoryEditComponent implements OnInit, AfterViewInit, AfterViewChecked {
    Title: string;
    subTitle: string = "";
    btnTitle: string;
    isEdit: boolean = false;

    category: ICategory;

    oldData = null;

    catTree: string;

    parsedHtml;

    roles: RoleClass[] = [];


    units: IUnit[] = [];

    attributes: any[] = [];
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

    fabButtons: MatFabMenu[] = [
        {
            id: 1,
            icon: 'refresh',
            tooltip: "بارگذاری مجدد فیلد ها",
            tooltipPosition: "right"
        },
        {
            id: 2,
            icon: 'exit_to_app',
            tooltip: "لغو",
            tooltipPosition: "right"
        },
        {
            id: 3,
            icon: 'save',
            tooltip: "ثبت",
            tooltipPosition: "right"
        },
    ];

    onFabMenuSelected(id) {
        if (id == 1) {
            this.refreshAttributes();
        }
        if (id == 2) {
            this.route.navigateByUrl(`/dashboard/${this.pageUrl}`);
        }
        if (id == 3) {
            this.sts();
        }
        if (id == 4) {
            this.addTemplateAttribute();
        }
        if (id == 5) {
            this.addQuestion();
        }
        if (id == 6) {
            this.addGroupQuestions();
        }
    }

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

                    this.auth.post("/api/Class/getAll").subscribe(data => {
                        if (data.success) {
                            this.classes = data.data;
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    });
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

                if (this.TYPE == 1) {
                    this.category.authorizeState = 2;
                    this.category.registerItemStepType = 1;
                }
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title =
                        `ویرایش ${this.pageTitle} ${this.category.title}`;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;

                    this.fabButtons.push({
                        id: 4,
                        icon: 'library_add',
                        tooltip: "افزودن فیلد",
                        tooltipPosition: "right"
                    });

                    if (this.TYPE == 1) {
                        this.fabButtons.push({
                            id: 5,
                            icon: 'playlist_add',
                            tooltip: "افزودن سوال",
                            tooltipPosition: "right"
                        }, {
                            id: 6,
                            icon: 'view_day',
                            tooltip: "افزودن گروهی سوال",
                            tooltipPosition: "right"
                        });
                    }

                    this.refreshAttributes();
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }

            this.refreshUnits();

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
            return this.classes.filter(c => c.gradeId == gradeId);
        }

        return [];
    }

    autoSetCatTitle() {
        if (!this.isEdit) {

            let gradeName = "";
            let courseName = "";
            let className = "";
            let examTypeName = "";

            if (this.category.gradeId) {
                gradeName = this.grades.find(c => c.id == this.category.gradeId).name;
            }

            if (this.category.courseId) {
                courseName = this.courses.find(c => c.id == this.category.courseId).name;
            }

            if (this.category.classId) {
                className = this.classes.find(c => c.id == this.category.classId).name;
            }

            if (this.category.examTypeId) {
                examTypeName = this.examTypes.find(c => c.id == this.category.examTypeId).name;
            }

            this.category.title = `${courseName} ${gradeName} ${className} ${examTypeName}`;
        }
    }


    getShiftedItem(attr: IAttr) {
        let options: IAttributeOption[] = (attr as any).attributeOptions || [];

        return options;
    }

    getAttrsForUnit(unitId): any[] {
        return this.attributes.filter(c => c.unitId == unitId);
    }

    setIsTrueQuestionOption(option, questionId, attr) {

        option.questionId = questionId;
        option.isTrue = false;

        this.auth.post("/api/Question/SetTrueOption", option).subscribe(data => {
            if (data.success) {
                try {
                    this.attributes.find(c => c == attr).attributeOptions.forEach(option => {
                        option.isTrue = false;
                    });
                    this.attributes.find(c => c == attr).attributeOptions.find(c => c == option).isTrue = true;
                } catch { }
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

            if (confirm("آیا از حذف این فیلد اطمینان دارید؟")) {
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

    isUserAccessToEditAttr(): boolean {
        return this.auth.isUserAccess(this.TYPE == 0 ? "edit_Attribute" : "edit_OnlineExamOption");
    }

    getAttrEditUrl(id) {
        return `/dashboard/${this.TYPE == 0 ? "attribute" : "online-exam/option"}/edit/${id}`;
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

    refreshUnits(isFromRefreshAttrs = false) {
        this.auth.post("/api/Unit/GetAll").subscribe(data => {
            if (data.success) {
                this.units = data.data;

                if (this.isEdit && !isFromRefreshAttrs) {
                    this.refreshAttributes();
                }

            } else {
                this.message.showMessageforFalseResult(data);
            }
        });
    }

    catAllQuestionNumber = 0;
    catEasyQuestionNumber = 0;
    catHardQuestionNumber = 0;
    catVeryHardQuestionNumber = 0;
    catModrateQuestionNumber = 0;

    refreshAttributes() {
        this.isLoading = true;

        this.refreshUnits(true);

        this.auth.post("/api/Attribute/getAttrsForCat", this.category.id)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(data => {
                if (data.success) {
                    this.attributes = data.data;

                    this.catAllQuestionNumber = this.attributes.filter(c => c.attrTypeInt == 11).length;

                    this.catHardQuestionNumber = this.attributes.filter(c => c.questionDefactInt == 1).length;
                    this.catModrateQuestionNumber = this.attributes.filter(c => c.questionDefactInt == 2).length;
                    this.catEasyQuestionNumber = this.attributes.filter(c => c.questionDefactInt == 3).length;
                    this.catVeryHardQuestionNumber = this.attributes.filter(c => c.questionDefactInt == 4).length;
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
        return getPostTypeString(type, this.auth.fadakTitle, this.auth.hedayatTahsiliTitle, this.auth.blogTitle, this.auth.bargozideganTitle, this.auth.porseshMotadavelTitle, this.auth.ehrazeHoviatTitle);
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

                            this.d3.reset();
                            this.route.navigate([`/dashboard/${this.pageUrl}/edit/${data.data}`]);
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
                catId: this.category.id,
                selectedGrade: this.category.gradeId,
                selectedCourse: this.category.courseId
            }
        });

        dialog.afterClosed().subscribe(result => {
            this.refreshAttributes();
        });
    }

    addGroupQuestions() {
        const dialog = this.dialog.open(AddGroupQuestionModalComponent, {
            data: {
                catId: this.category.id,
                selectedGrade: this.category.gradeId,
                selectedCourse: this.category.courseId
            }
        });

        dialog.afterClosed().subscribe(result => {
            if (result) {
                this.refreshAttributes();
            }
        });
    }

    getQuestionNumber() {
        if (this.isEdit) {
            return this.attributes.filter(c => c.attrTypeInt == 11).length;
        }

        return 0;
    }

    getSumOfDefctQuestionNumbers() {
        const veryHardQuestionNumber = this.category.veryHardQuestionNumber || 0;
        const hardQuestionNumber = this.category.hardQuestionNumber || 0;
        const moderateQuestionNumber = this.category.moderateQuestionNumber || 0;
        const easyQuestionNumber = this.category.easyQuestionNumber || 0;


        return veryHardQuestionNumber + hardQuestionNumber + moderateQuestionNumber + easyQuestionNumber;
    }

    getAttributeTypeString(attrType: number) {
        return getAttributeTypeString(attrType);
    }

    getAttributeTypeIcon(attrType: number) {
        return getAttributeTypeIcon(attrType);
    }

    openQuickAddAttributeModal(attrType: number) {
        this.dialog.open(QuickAddAttributeModalComponent, {
            data: {
                attrType: attrType,
                catId: this.category.id
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                this.refreshAttributes();
            }
        });
    }

    showAttributeChartData(attrId: number) {
        this.dialog.open(AttributeChartDataModalComponent, {
            data: {
                attrId: attrId,
                catId: this.category.id
            }
        });
    }

}

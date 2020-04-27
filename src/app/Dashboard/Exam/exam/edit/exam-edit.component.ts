import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IExam } from "../exam";
import { IExamType } from "../../examtype/examtype";
import { IGrade } from "src/app/Dashboard/grade/grade";
import { IClass } from "src/app/Dashboard/class/class";
import { ITeacher } from "src/app/Dashboard/teacher/teacher";
import { IYeareducation } from "src/app/Dashboard/yeareducation/yeareducation";
import { ICourse } from "src/app/Dashboard/course/course";
import { IWorkbook } from "src/app/Dashboard/workbook/workbook";

declare var $: any;

@Component({
    templateUrl: "./exam-edit.component.html"
})
export class ExamEditComponent implements AfterViewInit, OnInit, OnDestroy {

    Title: string;
    btnTitle: string;
    isEdit: boolean = false;


    exam: IExam;

    oldData = null;

    resultTime: string = "";

    isTimeOpened = false;

    exams: IExam[] = [];

    examTypes: IExamType[] = [];
    grades: IGrade[] = [];
    classes: IClass[] = [];
    teachers: ITeacher[] = [];
    yeareducations: IYeareducation[] = [];
    courses: ICourse[] = [];
    workbooks: IWorkbook[] = [];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.exam = data.exam;

                this.oldData = JSON.stringify(data.exam);

                this.resultTime = this.exam.resultTime;
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "تعریف آزمون";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش  " + this.exam.name;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }

            $("#divtree").jstree("deselect_all");
            $("#divtree").jstree("refresh");
            $("#divtree").jstree("open_all");
            $("#divtree").on("load_node.jstree", (e, n) => {
                if (n.node.id == this.exam.parentId) {
                    $("#divtree").jstree(
                        "select_node",
                        "#" + this.exam.parentId,
                        true
                    );
                }
            });
        });

    }

    ngOnDestroy(): void {
        let title = "exam";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.exam)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    ngAfterViewInit(): void {
        var sanitizerUr = url => {
            return this.auth.serializeUrl(url);
        };
        $("#divtree").jstree({
            plugins: ["wholerow", "types"],
            core: {
                data: {
                    url: function (node) {
                        return node.id === "#"
                            ? sanitizerUr("/api/Exam/GetTreeRoot")
                            : sanitizerUr(
                                "/api/Exam/GetTreeChildren/" + node.id
                            );
                    },
                    data: function (node) {
                        return { id: node.id };
                    }
                },
                strings: {
                    "Loading ...": "لطفا اندکی صبر نمایید"
                },
                multiple: false
            },
            types: {
                default: {
                    icon: "fa fa-folder"
                }
            }
        });

        $("#divtree").on("changed.jstree", (e, data) => {
            if (data.node) {
                this.exam.parentId = data.node.id;
            }
        });

        $("#divtree").on("ready.jstree", () => {
            $("#divtree").jstree("open_all");
        });

        $("#divtree").on("load_node.jstree", (e, n) => {
            if (n.node.id == this.exam.parentId) {
                $("#divtree").jstree(
                    "select_node",
                    "#" + this.exam.parentId,
                    true
                );
            }
        });



    }
    ngOnInit(): void {
        this.auth.post("/api/Exam/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.exams = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );

        this.auth.post("/api/ExamType/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.examTypes = data.data;
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
        this.auth.post("/api/Yeareducation/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.yeareducations = data.data;
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
        this.auth.post("/api/Workbook/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.workbooks = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    onTimeOpened() {
        this.isTimeOpened = true;
    }

    clearSelection() {
        $("#divtree").jstree("deselect_all");
        this.exam.parentId = null;
    }

    openAllTree() {
        $("#divtree").jstree("open_all");
    }

    closeAllTree() {
        var a = $("#divtree").jstree("close_all");
    }

    checkForNodeOpen(): boolean {
        if ($("#divtree li.jstree-open").length) {
            return true;
        } else {
            return false;
        }
    }

    copySelectedData(id) {
        if (id != 0) {
            this.auth.post("/api/Exam/getExam", id).subscribe(
                (data: jsondata) => {
                    if (data.success) {

                        var examB: IExam = data.data;

                        this.exam.name = examB.name;
                        this.exam.numberQ = examB.numberQ;
                        this.exam.source = examB.source;
                        this.exam.topScore = examB.topScore;
                        this.exam.time = examB.time;
                        this.exam.order = examB.order;
                        this.exam.parentId = examB.parentId;

                        this.exam.examTypeId = examB.examTypeId;
                        this.exam.yeareducationId = examB.yeareducationId;
                        this.exam.gradeId = examB.gradeId;
                        this.exam.classId = examB.classId;
                        this.exam.courseId = examB.courseId;
                        this.exam.teacherId = examB.teacherId;
                        

                        $("#divtree").jstree("deselect_all");
                        $("#divtree").jstree("refresh");
                        $("#divtree").jstree("open_all");
                        $("#divtree").on("load_node.jstree", (e, n) => {
                            if (n.node.id == this.exam.parentId) {
                                $("#divtree").jstree(
                                    "select_node",
                                    "#" + this.exam.parentId,
                                    true
                                );
                            }
                        });
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

    openc(picker) {
        picker.open();
    }

    setTeacherIdByCourse() {
        if (this.exam.courseId) {
            var course = this.courses.find(c => c.id == this.exam.courseId);
            if (course) {
                this.exam.teacherId = course.teacherId;
            }
        }
    }

    getFiltredClass() {
        var gradeId = this.exam.gradeId;
        if (gradeId) {
            return this.classes.filter(c => c.gradeId == gradeId)
        }

        return this.classes;
    }

    getFiltredCourse() {
        var gradeId = this.exam.gradeId;
        if (gradeId) {
            return this.courses.filter(c => c.gradeId == gradeId)
        }

        return this.courses;
    }

    sts() {
        if (this.fm1.valid) {
            if (!this.exam.source) {
                this.exam.source = "نا مشخص";
            }
            if (this.isEdit) {
                this.auth
                    .post("/api/Exam/Edit", {
                        exam: this.exam,
                        resultTime: this.resultTime
                    }, {
                        type: 'Edit',
                        agentId: this.auth.getUserId(),
                        agentType: 'User',
                        agentName: this.auth.getUser().fullName,
                        tableName: 'Edit Exam',
                        logSource: 'dashboard',
                        object: this.exam,
                        oldObject: JSON.parse(this.oldData),
                        table: "Exam",
                        tableObjectIds: [this.exam.id]
                    })
                    .subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.message.showSuccessAlert(
                                    "با موفقیت ثبت شد"
                                );

                                this.route.navigate(["/dashboard/exam"]);
                            } else {
                                this.message.showMessageforFalseResult(data);
                            }
                        },
                        er => {
                            this.auth.handlerError(er);
                        }
                    );
            } else {
                this.auth
                    .post("/api/Exam/Add", {
                        exam: this.exam,
                        resultTime: this.resultTime
                    }, {
                        type: 'Add',
                        agentId: this.auth.getUserId(),
                        agentType: 'User',
                        agentName: this.auth.getUser().fullName,
                        tableName: 'Add Exam',
                        logSource: 'dashboard',
                        object: this.exam,
                        table: "Exam",
                        tableObjectIds: [this.exam.id]
                    })
                    .subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.message.showSuccessAlert(
                                    "با موفقیت ثبت شد"
                                );

                                this.route.navigate(["/dashboard/exam"]);
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
}

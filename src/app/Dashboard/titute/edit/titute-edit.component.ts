import { Component, AfterViewInit, ViewChild, AfterViewChecked, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { ITitute } from "../titute";
import { NgForm } from "@angular/forms";

declare var $: any;

@Component({
    templateUrl: "./titute-edit.component.html",
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
        `
    ]
})
export class TituteEditComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    titute: ITitute;

    oldData = null;

    titutes: ITitute[] = [];

    @ViewChild("fm1", {static: false}) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.titute = data.titute;

                this.oldData = JSON.stringify(data.titute);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن آموزشگاه";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش آموزشگاه " + this.titute.name;
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
                if (n.node.id == this.titute.tituteCode) {
                    $("#divtree").jstree(
                        "select_node",
                        "#" + this.titute.tituteCode,
                        true
                    );
                }
            });
        });

        this.auth.post("/api/Titute/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.titutes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    ngOnDestroy(): void {
        let title = "titute";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.titute)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    ngAfterViewChecked(): void {
        var sanitizerUr = url => {
            return this.auth.serializeUrl(url);
        };
        $("#divtree").jstree({
            plugins: ["wholerow", "types"],
            core: {
                data: {
                    url: function(node) {
                        return node.id === "#"
                            ? sanitizerUr("/api/Titute/GetTreeRoot")
                            : sanitizerUr(
                                  "/api/Titute/GetTreeChildren/" + node.id
                              );
                    },
                    data: function(node) {
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
                this.titute.tituteCode = data.node.id;
            }
        });

        $("#divtree").on("ready.jstree", () => {
            $("#divtree").jstree("open_all");
        });

        $("#divtree").on("load_node.jstree", (e, n) => {
            if (n.node.id == this.titute.tituteCode) {
                $("#divtree").jstree(
                    "select_node",
                    "#" + this.titute.tituteCode,
                    true
                );
            }
        });
    }

    ngAfterViewInit(): void {

    }

    clearSelection() {
        $("#divtree").jstree("deselect_all");
        this.titute.tituteCode = null;
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
            this.auth.post("/api/Titute/getTitute", id).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.titute = data.data;
                        this.titute.id = 0;
                        $("#divtree").jstree("deselect_all");
                        $("#divtree").jstree("refresh");
                        $("#divtree").jstree("open_all");
                        $("#divtree").on("load_node.jstree", (e, n) => {
                            if (n.node.id == this.titute.tituteCode) {
                                $("#divtree").jstree(
                                    "select_node",
                                    "#" + this.titute.tituteCode,
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

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/Titute/Edit", this.titute, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Titute',
                    logSource: 'dashboard',
                    object: this.titute,
                    oldObject: JSON.parse(this.oldData),
                    table: "Titute",
                    tableObjectIds: [this.titute.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/titute"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Titute/Add", this.titute, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Titute',
                    logSource: 'dashboard',
                    object: this.titute,
                    table: "Titute",
                    tableObjectIds: [this.titute.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/titute"]);
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

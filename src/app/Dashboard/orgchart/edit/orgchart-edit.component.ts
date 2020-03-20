import { Component, ViewChild, AfterViewChecked, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IOrgChart } from "../orgchart";

declare var $: any;

@Component({
    templateUrl: "./orgchart-edit.component.html"
})
export class OrgChartEditComponent implements AfterViewChecked, OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    orgchart: IOrgChart;

    oldData = null;

    orgcharts: IOrgChart[] = [];

    @ViewChild("fm1", {static: false}) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.orgchart = data.orgchart;

                this.oldData = JSON.stringify(data.orgchart);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "تعریف چارت سازمانی";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش چارت سازمانی " + this.orgchart.name;
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
                if (n.node.id == this.orgchart.parentId) {
                    $("#divtree").jstree(
                        "select_node",
                        "#" + this.orgchart.parentId,
                        true
                    );
                }
            });
        });

        this.auth.post("/api/OrgChart/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.orgcharts = data.data;
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
        let title = "orgchart";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.orgchart)
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
                            ? sanitizerUr("/api/OrgChart/GetTreeRoot")
                            : sanitizerUr(
                                  "/api/OrgChart/GetTreeChildren/" + node.id
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
                this.orgchart.parentId = data.node.id;
            }
        });

        $("#divtree").on("ready.jstree", () => {
            $("#divtree").jstree("open_all");
        });

        $("#divtree").on("load_node.jstree", (e, n) => {
            if (n.node.id == this.orgchart.parentId) {
                $("#divtree").jstree(
                    "select_node",
                    "#" + this.orgchart.parentId,
                    true
                );
            }
        });
    }

    clearSelection() {
        $("#divtree").jstree("deselect_all");
        this.orgchart.parentId = null;
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
            this.auth.post("/api/OrgChart/getChart", id).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.orgchart = data.data;
                        this.orgchart.id = 0;
                        $("#divtree").jstree("deselect_all");
                        $("#divtree").jstree("refresh");
                        $("#divtree").jstree("open_all");
                        $("#divtree").on("load_node.jstree", (e, n) => {
                            if (n.node.id == this.orgchart.parentId) {
                                $("#divtree").jstree(
                                    "select_node",
                                    "#" + this.orgchart.parentId,
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
                this.auth.post("/api/OrgChart/Edit", this.orgchart, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'OrgChart',
                    logSource: 'dashboard',
                    object: this.orgchart,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/orgchart"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/OrgChart/Add", this.orgchart, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName:'OrgChart',
                    logSource: 'dashboard',
                    object: this.orgchart,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/orgchart"]);
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

import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { RoleClass } from "../role";
import { NgForm } from "@angular/forms";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { getPostTypeString } from "../../WebSiteManagment/post/post";

@Component({
    templateUrl: "./role-edit.component.html"
})
export class RoleEditComponent implements AfterViewInit {

    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    Role: RoleClass = new RoleClass();

    oldData = null;

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            var id = params["id"];

            if (id === "0") {
                this.Role = new RoleClass();
                this.Title = "افزودن سطح دسترسی";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.auth.post("/api/Role/GetRole", id).subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.Role = data.data;

                                this.oldData = JSON.stringify(data.data);

                                this.Title =
                                    "ویرایش سطح دسترسی " + this.Role.name;
                                this.btnTitle = "ویرایش";
                                this.isEdit = true;
                            } else {
                                this.message.showMessageforFalseResult(data);
                            }
                        },
                        er => {
                            this.auth.handlerError(er);
                        }
                    );
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        });
    }

    ngAfterViewInit(): void {

    }

    getPostTypeString(type) {
        return getPostTypeString(type);
    }

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/Role/Edit", this.Role, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Role',
                    logSource: 'dashboard',
                    object: this.Role,
                    oldObject: JSON.parse(this.oldData),
                    table: "Role",
                    tableObjectIds: [this.Role.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            if (this.Role.id == this.auth.getUserRole().id) {
                                this.auth.refreshUserData();
                            }

                            this.route.navigate(["/dashboard/role"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Role/Add", this.Role, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName:'Role',
                    logSource: 'dashboard',
                    object: this.Role,
                    table: "Role",
                    tableObjectIds: [this.Role.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/role"]);
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

import { Component, ViewChild, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { IUser } from "../user";
import { RoleClass } from "../../role/role";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { NgForm } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
// var resizebase64 = require("resize-base64");

@Component({
    templateUrl: "./edit-user.component.html"
})
export class EditUserComponent implements OnDestroy {
    Title: string;

    btnTitle: string;

    User: IUser = new IUser();

    oldData = null;

    roles: RoleClass[] = [];

    isEdit: boolean = false;

    isLoading: boolean;

    @ViewChild("fm1", {static: false}) public fm1: NgForm;
    @ViewChild("d1", { static: false }) public d1;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        public auth: AuthService,
        private message: MessageService,
        private sanitizer: DomSanitizer
    ) {
        activeRoute.params.subscribe(params => {
            this.isLoading = true;
            var id = params["id"];
            if (id === "0") {
                this.Title = "افزودن کاربر";
                this.btnTitle = "افزودن";
                this.isEdit = false;
                this.User = new IUser();
                this.isLoading = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.btnTitle = "ویرایش";
                    this.Title =
                        "ویرایش کاربر " +
                        this.User.firstname +
                        " " +
                        this.User.lastname;
                    this.isEdit = true;
                }
            }

            this.activeRoute.data.subscribe(data => {
                this.User = data.user;
                this.roles = data.role;

                this.oldData = JSON.stringify(data.user);

                if (!this.User.picData) {
                    this.User.picData = "";
                }
            });

            this.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        let title = "user";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.User)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    sts() {
        if (this.fm1.valid && this.isRoleselected()) {
            if (this.isEdit) {
                this.auth.post("/api/User/Edit", this.User, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'User',
                    logSource: 'dashboard',
                    object: this.User,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showMessageForSuccessResult(data);
                            if (this.User.id == this.auth.getUser().id) {
                                this.auth.refreshUserData();
                            }
                            this.router.navigate(["/dashboard/user"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/User/Add", this.User, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'User',
                    logSource: 'dashboard',
                    object: this.User,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showMessageForSuccessResult(data);
                            this.router.navigate(["/dashboard/user"]);
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
            this.message.showWarningAlert(
                "تمامی فیلد ها را با دقت تکمیل نمایید"
            );
        }
    }

    
    setPic(files: File[]) {

        files.forEach(file => {
            if (file.size / 1024 / 1024 > 2) {
                this.d1.reset();
                return this.message.showWarningAlert(
                    "حجم فایل باید کمتر از " + " دو مگابایت " + " باشد",
                    "اخطار"
                );
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: ProgressEvent) => {
                let result = reader.result.toString().split(",")[1];

                this.User.picData = result;
                this.User.picName = file.name;
            };
        });
    }

    removePic() {
        this.d1.reset();
        this.User.picData = "";
        this.User.picName = "";
    }


    isRoleselected(): boolean {
        return this.User.roleId == 0 ? false : true;
    }
}

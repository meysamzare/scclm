import { Component, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "../shared/Auth/auth.service";
import { MessageService } from "../shared/services/message.service";
import { ICategory } from "../Dashboard/category/category";
import { NgForm } from "@angular/forms";

@Component({
    templateUrl: "./login-item.component.html"
})
export class LoginItemComponent {
    catId;
    type;

    category: ICategory;

    rahCode: string;

    ItemDataKEY: string = "_ie";

    @ViewChild("fm1", {static: false}) public fm1: NgForm;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService
    ) {
        this.activeRoute.params.subscribe(params => {
            this.catId = params["catId"];
            this.type = params["type"];

            if (this.type == 1 || this.type == 2) {
                // Do Nothing
            } else {
                this.router.navigateByUrl("/");
            }

            this.auth.post("/api/Category/getCategory", this.catId).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.category = data.data;

                        if (!this.category.haveInfo) {
                            this.router.navigate(["/"]);
                        }
                        if (!this.category.isInfoShow) {
                            this.router.navigate(["/"]);
                        }
                    } else {
                        this.message.showMessageForSuccessResult(data);
                        this.router.navigate(["/"]);
                    }
                },
                er => {
                    this.auth.handlerError(er);
                    this.router.navigate(["/"]);
                }
            );
        });
    }

    login() {
        if (this.fm1.valid) {
            this.auth.post("/api/Item/IsRahCodeExist", { rahCode: this.rahCode, catId: this.catId }).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.message.showSuccessAlert("با موفقیت وارد شدید");

                        let itemData = {
                            catId: this.catId,
                            rahCode: this.rahCode,
                            date: new Date(Date.parse(data.data))
                        };

                        localStorage.setItem(
                            this.ItemDataKEY,
                            JSON.stringify(itemData)
                        );

                        this.router.navigate(["/item-info/"+ this.catId +"/" + this.rahCode +"/"+ this.type], { skipLocationChange: true });
                    } else {
                        this.message.showWarningAlert(
                            " کد رهگیری اشتباه است"
                        );
                    }
                },
                er => {
                    this.auth.handlerError(er);
                }
            );
        }
    }
}

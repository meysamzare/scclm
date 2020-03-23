import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { IItemAttr } from 'src/app/Dashboard/item/item-attr';
import { ICategory, CategoryAuthorizeState } from 'src/app/Dashboard/category/category';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { DomSanitizer } from '@angular/platform-browser';
import { interval } from 'rxjs';
import Swal from "sweetalert2";
import { IUnit } from 'src/app/Dashboard/unit/unit';
import { RegisterItemLoginService } from './login-for-register-item/register-item-login.service';
import { RegisterItemLicenseService } from './license-for-register-item/register-item-license.service';

@Component({
    selector: 'app-register-item',
    templateUrl: './register-item.component.html',
    styleUrls: ['./register-item.component.scss']
})
export class RegisterItemCatComponent implements OnInit, AfterViewInit, OnDestroy {

    attrs: IAttr[] = [];

    itemAttrs: IItemAttr[] = [];

    catId;

    cat: ICategory;

    group: FormGroup;

    formGroupitem = [];

    attrUniqList: number[] = [];

    reqfilesAttrint: number[] = [];

    disableButton: boolean = false;

    isFromSts: boolean = false;

    interval1;

    units: IUnit[] = [];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    authorizedFullName: string = "---";
    authorizedUsername: string = "---";
    authorizedType: CategoryAuthorizeState = CategoryAuthorizeState.none;

    ngOnInit() { }


    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        public auth: AuthService,
        private message: MessageService,
        private sanitizer: DomSanitizer,
        private loginService: RegisterItemLoginService,
        private licenseService: RegisterItemLicenseService
    ) {
        this.activeRoute.params.subscribe(params => {
            this.catId = params["id"];
        });

        this.cat = this.activeRoute.snapshot.data.cat;


        if (!this.cat.canShowByDate) {
            this.message.showWarningAlert(
                "مهلت ثبت نام به پایان رسیده است",
                "خطا"
            );
            this.router.navigate(["/"]);
        }


        if (this.cat.authorizeState != CategoryAuthorizeState.none) {
            if (!this.loginService.isUserAccessToCat(this.catId)) {
                this.router.navigate([`/register-item/${this.catId}/login`], { skipLocationChange: true });
            } else {
                var token = this.loginService.getLoginToken(this.catId);

                if (!token) {
                    this.router.navigate(['/']);
                }

                this.authorizedFullName = token.userFullName;
                this.authorizedUsername = token.username;
                this.authorizedType = token.userType;
            }
        }

        if (this.cat.haveLicense) {
            if (!this.licenseService.isUserAcceptTheLicense(this.catId)) {
                this.router.navigate([`/register-item/${this.catId}/license`], { skipLocationChange: true });
            }
        }


        this.attrs = this.activeRoute.snapshot.data.attrs;
        this.units = this.activeRoute.snapshot.data.units;

        this.attrs.forEach(attr => {
            if (attr.attrTypeInt == 7 || attr.attrTypeInt == 8) {
                this.itemAttrs.push({
                    itemId: 0,
                    attributeId: attr.id,
                    attrubuteValue: "",
                    attributeFilePath: "1",
                    fileName: ""
                });
            } else {
                this.itemAttrs.push({
                    itemId: 0,
                    attributeId: attr.id,
                    attrubuteValue: "",
                    attributeFilePath: "",
                    fileName: ""
                });
            }
        });

        if (this.attrs.length == 0) {
            this.router.navigate(["/"]);
        }

        this.group = this.toFormGroup(this.attrs);

        // this.interval1 = interval(1000).subscribe(x => {
        //     if (!this.isValidToShow(this.cat)) {
        //         this.message.showWarningAlert(
        //             "مهلت ثبت نام به پایان رسیده است",
        //             "خطا"
        //         );
        //         this.router.navigate(["/"]);
        //     }
        // });
    }

    getAttrsForUnit(unitId) {
        return this.attrs.filter(c => c.unitId == unitId);
    }

    canShowUnit(unitId) {
        var attrs = this.getAttrsForUnit(unitId);

        if (attrs.length == 0) {
            return false;
        }

        return true;
    }

    ngOnDestroy(): void {
        // this.interval1.unsubscribe();
    }
    ngAfterViewInit(): void {
        window.scroll(0, 0);
    }

    toFormGroup(attrs: IAttr[]) {
        let group: any = {};

        attrs.forEach((attr, index) => {
            group["p" + index] = new FormControl(null,
                (attr.isRequired && attr.attrTypeInt != 4) ? Validators.required : null);
        });
        return new FormGroup(group);
    }

    getIndexForAttr(attrId) {
        return this.attrs.findIndex(c => c.id == attrId);
    }

    getRegisterBtnTitle(): string {
        var btnTitle = this.cat.btnTitle;
        if (!btnTitle || btnTitle == " ") {
            return "ثبت نام";
        }

        return btnTitle;
    }

    getAttrPlaceholder(placeholder: string, title: string): string {
        if (placeholder) {
            return placeholder;
        }

        return title;
    }

    canShowDesc(desc: string): boolean {
        if (desc) {
            return true;
        }

        return false;
    }


    isValidToShow(cat: ICategory): boolean {
        if (cat.isActive) {
            var datePub: Date = new Date(Date.parse(cat.datePublish));
            var dateEx: Date = new Date(Date.parse(cat.dateExpire));
            var nowDate: Date = new Date();

            if (nowDate > datePub && nowDate < dateEx) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    isFormDirty(): boolean {
        if (this.isFromSts) {
            return false;
        }
        return this.group.dirty;
    }

    openc(picker1) {
        picker1.open();
    }

    setItemAttr(event, attrId) {
        let inputValue;
        if (event.target) {
            inputValue = event.target.value;
        } else {
            inputValue = event.checked;
        }

        var itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);

        if (itemAttr) {
            itemAttr.attrubuteValue = inputValue;
        } else {
            this.itemAttrs.push({
                itemId: 0,
                attributeId: attrId,
                attrubuteValue: inputValue,
                attributeFilePath: "",
                fileName: ""
            });
        }
    }

    getShiftedItem(items: string) {
        var a = items.substring(1);

        return a.split(",");
    }

    setItemAttrforselect(event, attrId) {
        var itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);

        if (itemAttr) {
            itemAttr.attrubuteValue = event;
        } else {
            this.itemAttrs.push({
                itemId: 0,
                attributeId: attrId,
                attrubuteValue: event,
                attributeFilePath: "",
                fileName: ""
            });
        }
    }

    checkForUniqValue(event, attrId) {
        var val = event.target.value;
        if (!val) {
            return;
        }
        var catId = this.catId;

        this.auth
            .post("/api/Item/CheckForUniqAttr", {
                catId: catId,
                attrId: attrId,
                val: val
            })
            .subscribe(
                (data: jsondata) => {
                    var un = this.attrUniqList.find(c => c == attrId);
                    if (data.success) {
                        if (un) {
                            un = attrId;
                        } else {
                            this.attrUniqList.push(attrId);
                        }
                    } else {
                        if (un) {
                            var indexOf = this.attrUniqList.indexOf(attrId, 0);
                            if (indexOf > -1) {
                                this.attrUniqList.splice(indexOf, 1);
                            }
                        }
                    }
                },
                er => {
                    this.auth.handlerError(er);
                }
            );
    }

    isAtrrUniqExsist(attrId = 1): boolean {
        if (this.attrUniqList.length != 0) {
            return this.attrUniqList.some(c => c == attrId);
        } else {
            return false;
        }
    }

    setItemAttrforPic(event, attrId, type) {
        let reader = new FileReader();
        var size = type == "file" ? 15 : 10;
        var sizeText = size == 10 ? "پانزده مگابایت" : "ده مگابایت";
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            var fi = this.reqfilesAttrint.find(c => c == attrId);
            if (file.size / 1024 / 1024 > size) {
                event.target.value = null;
                event.target.files = null;
                if (fi) {
                    fi = attrId;
                } else {
                    var attr = this.attrs.find(c => c.id == attrId);
                    if (attr.isRequired) {
                        this.reqfilesAttrint.push(attrId);
                    }
                }
                return this.message.showWarningAlert("حجم فایل باید کمتر از " + sizeText + " باشد");
            }
            if (fi) {
                var indexOf = this.reqfilesAttrint.indexOf(attrId, 0);
                if (indexOf > -1) {
                    this.reqfilesAttrint.splice(indexOf, 1);
                }
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                let result = reader.result.toString().split(",")[1];

                var itemAttr = this.itemAttrs.find(
                    c => c.attributeId == attrId
                );

                if (itemAttr) {
                    itemAttr.attrubuteValue = result;
                    itemAttr.fileName = file.name;
                } else {
                    this.itemAttrs.push({
                        itemId: 0,
                        attributeId: attrId,
                        attrubuteValue: result,
                        attributeFilePath: "1",
                        fileName: file.name
                    });
                }
            };
        }
    }

    isFileExist(attrId) {
        if (this.reqfilesAttrint.length != 0) {
            return this.reqfilesAttrint.some(c => c == attrId);
        } else {
            return false;
        }
    }

    sts() {
        if (
            this.group.valid &&
            this.reqfilesAttrint.length == 0 &&
            this.attrUniqList.length == 0
        ) {
            this.disableButton = true;
            this.auth
                .post("/api/Item/SetItemeWithAttrs", {
                    itemAttrs: this.itemAttrs,
                    catId: this.catId,
                    authorizedFullName: this.authorizedFullName,
                    authorizedUsername: this.authorizedUsername,
                    authorizedType: this.authorizedType,
                }, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Item Register From Index',
                    logSource: 'dashboard',
                    object: {
                        itemAttrs: this.itemAttrs,
                        catId: this.catId
                    },
                })
                .subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            if (!data.message) {
                                data.message = "";
                            }

                            Swal.fire({
                                title: "ثبت نام شما با موفقیت انجام شد",
                                icon: "success",
                                text: data.message + " کد رهگیری شما : " + data.type,
                                confirmButtonText: "کد رهگیری را یادداشت کردم",
                                showCancelButton: false,
                                allowOutsideClick: false,
                                allowEnterKey: false,
                            }).then(result => {
                                if (result.value) {
                                    this.isFromSts = true;
                                    this.router.navigate(["/"]);
                                    this.loginService.removeToken(this.catId);
                                    this.licenseService.removeLicense(this.catId);
                                }
                            })
                        } else {
                            this.message.showWarningAlert(
                                "خطایی روی داده است لطفا با راهبر سیستم تماس حاصل فرمایید",
                                "خطا"
                            );
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.disableButton = false;
                        this.auth.handlerError(er);
                    }, () => {
                        this.disableButton = false;
                    }
                );
        } else {
            this.message.showWarningAlert("مقادیر خواسته شده را تکمیل نمایید");
        }
    }

}

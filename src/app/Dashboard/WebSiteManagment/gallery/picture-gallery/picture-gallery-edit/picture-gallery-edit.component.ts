import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IPictureGallery } from '../picture-gallery';
import { IPicture } from '../../picture/picture';

@Component({
    selector: 'app-picture-gallery-edit',
    templateUrl: './picture-gallery-edit.component.html',
    styleUrls: ['./picture-gallery-edit.component.scss']
})
export class PictureGalleryEditComponent implements OnInit, OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    PAGE_Data: IPictureGallery;

    oldData = null;

    pics: IPicture[] = [];

    PAGE_TITLE = " گالری تصاویر ";
    PAGE_TITLES = " گالری های تصاویر ";
    PAGE_APIURL = "PictureGallery";
    PAGE_URL = "picture-gallery";

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.PAGE_Data = data.pictureGallery;

                this.oldData = JSON.stringify(data.pictureGallery);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن " + this.PAGE_TITLE;
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش " + this.PAGE_TITLE + this.PAGE_Data.name;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;

                    this.auth.post("/api/Picture/getAllByGallery", id).subscribe(data => {
                        if (data.success) {
                            this.pics = data.data;
                        } else {
                            this.auth.message.showMessageforFalseResult(data);
                        }
                    }, er => {
                        this.auth.handlerError(er);
                    });

                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        });
    }

    ngOnDestroy(): void {
        let title = this.PAGE_APIURL;
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.PAGE_Data)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    deletePicture(id) {
        if (window.confirm("حذف این مورد غیر قابل بازگشت می باشد، آیا از حذف این تصویر اطمینان دارید")) {
            var ids = [];
            ids.push(id);
            var pic = this.pics.find(c => c.id == id);
            var deleteDatas = [pic];

            this.auth.post("/api/Picture/Delete", ids, {
                type: 'Delete',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Picture',
                logSource: 'dashboard',
                deleteObjects: deleteDatas,
            }).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.message.showSuccessAlert(
                            "با موفقیت حذف شد"
                        );

                        this.pics.splice(this.pics.findIndex(c => c == pic), 1);
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

    clearPictureGallery(id) {
        this.auth.post("/api/Picture/clearGallery", id).subscribe(data => {
            if (data.success) {
                var pic = this.pics.find(c => c.id == id);
                this.message.showSuccessAlert(
                    "با موفقیت ثبت شد"
                );

                this.pics.splice(this.pics.findIndex(c => c == pic), 1);
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/" + this.PAGE_APIURL + "/Edit", this.PAGE_Data, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'PictureGallery',
                    logSource: 'dashboard',
                    object: this.PAGE_Data,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/" + this.PAGE_URL]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.PAGE_Data.author = this.auth.getUser().fullName;
                this.auth.post("/api/" + this.PAGE_APIURL + "/Add", this.PAGE_Data, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'PAGE_Data',
                    logSource: 'dashboard',
                    object: this.PAGE_Data,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/" + this.PAGE_URL]);
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

    ngOnInit() {
    }

}

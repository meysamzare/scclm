import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IPost, getPostTypeString, getPostTypeRoleString } from '../post';
import { ITags } from 'src/app/Dashboard/item/tags';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import { IMainSlideShow } from '../../main-slide-show/main-slide-show';
import { ISchedule } from '../../schedule/schedule';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PictureSelectModalComponent } from 'src/app/html-tools/picture-select-modal/picture-select-modal.component';

@Component({
    selector: 'app-post-edit',
    templateUrl: './post-edit.component.html',
    styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit, OnDestroy {

    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    post: IPost;

    oldData = null;

    // ckEditorConfig = {
    //     language: 'fa',
    //     autoParagraph: false
    // };


    public Editor = ClassicEditor;
    public config = {
        language: {
            ui: 'fa',
            content: 'en'
        }
    };

    tags: ITags[] = [];

    readonly separatorKeysCodes: number[] = [ENTER];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;
    @ViewChild("fmTotal", { static: false }) public fmTotal: NgForm;
    @ViewChild("fm2", { static: false }) public fm2_AddMainSlideShow: NgForm;
    @ViewChild("fm3", { static: false }) public fm3_AddSchedule: NgForm;

    @ViewChild("d1", { static: false }) public d1;
    @ViewChild("d2", { static: false }) public d2_AddMainSlideShow;
    @ViewChild("d3", { static: false }) public d3_AddSchedule;

    additionalOptions = false;

    showAddMainSlideShow = false;
    showAddSchedule = false;

    mainslideshow: IMainSlideShow = new IMainSlideShow();
    Schedule: ISchedule = new ISchedule();

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService,
        private dialog: MatDialog
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                let mainData = data.post;

                this.post = mainData.post;
                this.mainslideshow = mainData.mainslideshow;
                this.Schedule = mainData.schedule;

                if (!this.post.headerPicData) {
                    this.post.headerPicData = "";
                }

                if (!this.Schedule.picData) {
                    this.Schedule.picData = "";
                }

                if (!this.mainslideshow.imgData) {
                    this.mainslideshow.imgData = "";
                }

                this.oldData = JSON.stringify(data.post);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن پست";
                this.btnTitle = "افزودن";
                this.isEdit = false;
                this.additionalOptions = this.activeRoute.snapshot.queryParams["additionalOptions"] || false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش پست " + this.post.name;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;

                    if (this.post.tags) {

                        this.post.tags.split(",").forEach(st => {
                            this.tags.push({ name: st });
                        });
                    }
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        });
    }

    ngOnDestroy(): void {
        let title = "post";
        if (!this.fmTotal.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify({
                        post: this.post,
                        mainslideshow: this.mainslideshow,
                        schedule: this.Schedule,
                    })
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    ngOnInit() {
    }


    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || "").trim()) {
            this.tags.push({ name: value.trim() });
        }

        if (input) {
            input.value = "";
        }
    }

    remove(tag: ITags): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }


    setPic(files: File[], type: "post" | "mainSlideShow" | "schedule" = "post") {

        files.forEach(file => {
            if (file.size / 1024 / 1024 > 10) {

                switch (type) {
                    case "post":
                        this.d1.reset();
                        break;
                    case "mainSlideShow":
                        this.d2_AddMainSlideShow.reset();
                        break;
                    case "schedule":
                        this.d3_AddSchedule.reset();
                        break;
                }

                return this.message.showWarningAlert(
                    "حجم فایل باید کمتر از " + " ده مگابایت " + " باشد",
                    "اخطار"
                );
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: ProgressEvent) => {
                let result = reader.result.toString().split(",")[1];

                switch (type) {
                    case "post":
                        this.post.headerPicData = result;
                        this.post.headerPicName = file.name;
                        break;
                    case "mainSlideShow":
                        this.mainslideshow.imgData = result;
                        this.mainslideshow.imgName = file.name;
                        break;
                    case "schedule":
                        this.Schedule.picData = result;
                        this.Schedule.picName = file.name;
                        break;
                }

            };
        });
    }

    getPostTypeString(type) {
        return getPostTypeString(type);
    }

    getPostTypeRoleString(type) {
        return getPostTypeRoleString(type);
    }

    removePic(type: "post" | "mainSlideShow" | "schedule" = "post") {
        switch (type) {
            case "post":
                this.d1.reset();
                this.post.headerPicData = "";
                this.post.headerPicName = "";
                break;
            case "mainSlideShow":
                this.d2_AddMainSlideShow.reset();
                this.mainslideshow.imgData = "";
                this.mainslideshow.imgName = "";
                break;
            case "schedule":
                this.d3_AddSchedule.reset();
                this.Schedule.picData = "";
                this.Schedule.picName = "";
                break;
        }
    }

    getFileUrl(url): string {
        return this.auth.apiUrl + url.substr(1);
    }

    getAcceptFileFormat() {
        if (this.post.haveVideo) {
            return "video/*";
        } else {
            return "image/png,image/jpeg";
        }
    }


    openc(picker) {
        picker.open();
    }


    getSubmitButtonDisabledState(): boolean {
        return (
            (this.fm1.invalid || (!this.isEdit && this.post.headerPicData.length == 0)) ||
            (this.showAddMainSlideShow && (this.fm2_AddMainSlideShow.invalid || (!this.isEdit && this.mainslideshow.imgData.length == 0))) ||
            (this.showAddSchedule && (this.fm3_AddSchedule.invalid || (!this.isEdit && this.Schedule.picData.length == 0)))
        );
    }

    sts() {
        if (this.fm1.valid) {

            this.post.tags = "";

            if (this.tags.length != 0) {

                this.tags.forEach((tag, index) => {
                    if (index == 0) {
                        this.post.tags += tag.name;
                    } else {
                        this.post.tags += "," + tag.name;
                    }
                });
            }

            var userfullname = this.auth.getUser().firstname + " " + this.auth.getUser().lastname;

            this.post.author = userfullname;

            if (this.isEdit) {
                this.auth.post("/api/Post/Edit", this.post, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Post',
                    logSource: 'dashboard',
                    object: this.post,
                    oldObject: JSON.parse(this.oldData),
                    table: "Post",
                    tableObjectIds: [this.post.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/post"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Post/Add", this.post, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Post',
                    logSource: 'dashboard',
                    object: this.post,
                    table: "Post",
                    tableObjectIds: [this.post.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {

                            var postId = +data.message;

                            if (this.showAddMainSlideShow) {
                                this.mainslideshow.title = this.post.title;
                                this.mainslideshow.name = this.post.name;
                                this.mainslideshow.page = 1;
                                this.mainslideshow.showState = true;

                                this.mainslideshow.postId = postId;

                                this.auth.post("/api/MainSlideShow/Add", this.mainslideshow, {
                                    type: 'Add',
                                    agentId: this.auth.getUserId(),
                                    agentType: 'User',
                                    agentName: this.auth.getUser().fullName,
                                    tableName: 'MainSlideShow_Added With Post',
                                    logSource: 'dashboard',
                                    object: this.mainslideshow,
                                    table: "MainSlideShow",
                                    tableObjectIds: [this.mainslideshow.id]
                                }).subscribe(null, () => {
                                    this.message.showErrorAlert("افزودن اسلاید شو با خطا مواجه شد!")
                                });
                            }

                            if (this.showAddSchedule) {
                                this.Schedule.postId = postId;
                                this.Schedule.title = this.post.title;

                                this.auth.post("/api/Schedule/Add", this.Schedule, {
                                    type: 'Add',
                                    agentId: this.auth.getUserId(),
                                    agentType: 'User',
                                    agentName: this.auth.getUser().fullName,
                                    tableName: 'Schedule_Added With Post',
                                    logSource: 'dashboard',
                                    object: this.Schedule,
                                    table: "Schedule",
                                    tableObjectIds: [this.Schedule.id]
                                }).subscribe(null, () => {
                                    this.message.showErrorAlert("افزودن رویداد با خطا مواجه شد!")
                                });
                            }

                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/post"]);
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

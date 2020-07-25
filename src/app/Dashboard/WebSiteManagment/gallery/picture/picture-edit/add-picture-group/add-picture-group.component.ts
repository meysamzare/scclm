import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IPictureGallery } from '../../../picture-gallery/picture-gallery';
import { IPicture } from '../../picture';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'app-add-picture-group',
    templateUrl: './add-picture-group.component.html',
    styleUrls: ['./add-picture-group.component.scss']
})
export class AddPictureGroupComponent implements OnInit {
    Title: string;
    btnTitle: string;

    PAGE_Data: IPicture = new IPicture();

    PictureGalleries: IPictureGallery[] = [];

    PAGE_TITLE = " تصویر ";
    PAGE_TITLES = " تصاویر ";
    PAGE_APIURL = "Picture";
    PAGE_URL = "picture";

    pictures: {
        picData: string;
        picName: string;
    }[] = [];

    isUploading = false;

    PS_Uploading = 0;
    totalRequestSize = 0;
    doneRequestSize = 0;

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    @Output() done = new EventEmitter<boolean>();

    @Input() fromModal = false;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        this.Title = "افزودن گروهی تصاویر";
        this.btnTitle = "ثبت";

        this.addOneToPictureList();

        this.auth.post("/api/PictureGallery/getAll").subscribe(data => {
            if (data.success) {
                this.PictureGalleries = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    addOneToPictureList() {
        this.pictures.push({
            picData: "",
            picName: ""
        });
    }

    removeFromPictureList(pic) {
        this.pictures.splice(this.pictures.findIndex(c => c == pic), 1);
    }

    setPictureForPicList(files: File[], pic) {

        files.forEach(file => {
            if (file.size / 1024 / 1024 > 2) {
                return this.message.showWarningAlert(
                    "حجم فایل باید کمتر از " + " دو مگابایت " + " باشد",
                    "اخطار"
                );
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: ProgressEvent) => {
                let result = reader.result.toString().split(",")[1];

                var pictureListItem = this.pictures.find(c => c == pic);

                pictureListItem.picData = result;
                pictureListItem.picName = file.name;
            };
        });
    }

    isAllPicSelected(): boolean {
        var picCount = this.pictures.length;
        var unSelectedPicCount = 0;

        this.pictures.forEach(pic => {
            if (!pic.picData) {
                unSelectedPicCount += 1;
            }
        });

        if (picCount != 0 && unSelectedPicCount == 0) {
            return true;
        }

        return false;
    }

    sts() {
        if (this.fm1.valid) {

            this.PAGE_Data.author = this.auth.getUser().fullName;

            var obj = {
                picData: this.PAGE_Data,
                pictures: this.pictures
            }

            var req = this.auth.postRequest("/api/" + this.PAGE_APIURL + "/AddGroup", obj);

            this.auth.http.request(req).subscribe((event) => {
                switch (event.type) {
                    case HttpEventType.Sent:
                        this.isUploading = true;
                        break;
                    case HttpEventType.UploadProgress:
                        this.PS_Uploading = (100 * event.loaded / event.total);

                        this.totalRequestSize = (event.total / 1024 / 1024);
                        this.doneRequestSize = (event.loaded / 1024 / 1024);

                        break;

                    case HttpEventType.Response:
                        var data: any = event.body;

                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            var picNames = [];

                            this.pictures.forEach(pic => {
                                picNames.push(pic.picName);
                            });

                            (obj.pictures as any[]) = picNames;

                            this.auth.logToServer({
                                type: 'Add',
                                agentId: this.auth.getUserId(),
                                agentType: 'User',
                                agentName: this.auth.getUser().fullName,
                                tableName: "Picture Group",
                                logSource: 'dashboard',
                                object: obj,
                                table: this.PAGE_APIURL,
                                tableObjectIds: [this.PAGE_Data.id]
                            }, data);

                            if (this.fromModal) {
                                this.done.emit(true);
                            } else {
                                this.route.navigate(["/dashboard/" + this.PAGE_URL]);
                            }

                        } else {
                            this.message.showMessageforFalseResult(data);
                            
                            if (this.fromModal) {
                                this.done.emit(false);
                            } else {
                                this.route.navigate(["/dashboard/" + this.PAGE_URL]);
                            }
                        }
                        break;
                }
            });
        }
    }

    ngOnInit() {
    }

}

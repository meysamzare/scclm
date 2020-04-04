import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ILink } from '../link';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IProduct } from '../../Product/product';
import { HttpClient, HttpEventType, HttpRequest, HttpHeaders } from '@angular/common/http';
import { map, last } from 'rxjs/operators';

@Component({
    selector: 'app-link-edit',
    templateUrl: './link-edit.component.html',
    styleUrls: ['./link-edit.component.scss']
})
export class LinkEditComponent implements OnInit, OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    PAGE_Data: ILink;

    oldData = null;

    PAGE_TITLE = " لینک دانلود ";
    PAGE_TITLES = " لینک های دانلود ";

    PAGE_APIURL = "Link";
    PAGE_URL = "link";

    TYPE = 0;

    valueTitle = "تعداد صفحات";

    productTitle = "محصول";

    products: IProduct[] = [];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;
    @ViewChild("file1", { static: false }) public file1: ElementRef;

    isUploading = false;
    fileSize_MB = 0;
    uploaded_MB = 0;
    uploaded_PS = 0;

    _file: File = null;

    fileSelectState: "input" | "url" = "input";
    fileExternalUrl = "";

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService,
        private http: HttpClient
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.PAGE_Data = data.link;

                this.TYPE = data["type"];

                this.oldData = JSON.stringify(data.link);

                if (!this.PAGE_Data.fileData) {
                    this.PAGE_Data.fileData = "";
                }

                if (this.TYPE == 1) {
                    this.PAGE_URL = "virtual-teaching/offline/link";

                    this.valueTitle = "مدت زمان به دقیقه";
                    this.productTitle = "آموزش مجازی";

                    this.PAGE_TITLE = " فایل آموزش مجازی ";
                    this.PAGE_TITLES = " فایل های آموزش مجازی ";

                }

            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن " + this.PAGE_TITLE;
                this.btnTitle = "افزودن";
                this.isEdit = false;

                if (this.TYPE == 1) {
                    this.PAGE_Data.price = 0;
                }
            } else {
                this.Title = "ویرایش " + this.PAGE_TITLE + this.PAGE_Data.title;
                this.btnTitle = "ویرایش";
                this.isEdit = true;
            }

            this.auth.post("/api/Product/getAll", this.TYPE).subscribe(data => {
                if (data.success) {
                    this.products = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
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

    onFileStateChange() {
        this.fileExternalUrl = "";
        this._file = null;
    }

    setFile(event) {
        if (event.target.files && event.target.files.length > 0) {
            let file: File = event.target.files[0];

            this._file = file;

            // this.fileSize_MB = (file.size / 1024 / 1024);
        }
    }

    removeFile() {
        this.file1.nativeElement.value = null;
        this._file = null;
        this.fileSize_MB = 0;
    }


    getSlicedPrice() {
        var price = this.PAGE_Data.price;
        if (price) {
            return price.toLocaleString();
        }
    }

    onProductSelect() {
        var productId = this.PAGE_Data.productId;

        if (productId) {
            var product = this.products.find(c => c.id == productId);

            var type = product.type;
            if (type == 0 || type == 1) {
                this.valueTitle = "تعداد صفحات";
            }

            if (type == 2 || type == 3) {
                this.valueTitle = "مدت زمان به دقیقه";
            }
        }
    }

    sts() {
        if (this.fm1.valid) {

            if (this.isEdit == false && this.fileSelectState == "input" && this._file == null) {
                return;
            }

            if (this.isEdit == false && this.fileSelectState == "url" && !this.fileExternalUrl) {
                return;
            }

            let formData = new FormData();

            formData.append("object", JSON.stringify(this.PAGE_Data));
            formData.append("fileExternalUrl", this.fileExternalUrl);
            if (this._file) {
                formData.append("file", this._file, this._file.name);
            }

            let url = this.auth.serializeUrl(`/api/${this.PAGE_APIURL}/${this.isEdit ? 'Edit' : 'Add'}`);

            let token = this.auth.getToken();

            let request = new HttpRequest('POST', url, formData, {
                reportProgress: true,
                headers: new HttpHeaders({
                    Authorization: `Bearer ${token}`,
                    "ngsw-bypass": "true"
                }),
            });

            this.http.request(request).pipe(
                map(event => {
                    switch (event.type) {
                        case HttpEventType.Sent:
                            this.isUploading = true;
                            break;
                        case HttpEventType.UploadProgress || HttpEventType.DownloadProgress:

                            const percentDone = (100 * event.loaded / event.total);

                            this.uploaded_PS = percentDone;

                            var uploadedSize = event.loaded / 1024 / 1024;
                            this.uploaded_MB = uploadedSize;

                            this.fileSize_MB = event.total / 1024 / 1024

                            break;
                        case HttpEventType.Response:
                            var data: any = event.body;

                            if (data.success) {
                                this.isUploading = false;

                                if (this.isEdit) {
                                    this.auth.logToServer({
                                        type: 'Edit',
                                        agentId: this.auth.getUserId(),
                                        agentType: 'User',
                                        agentName: this.auth.getUser().fullName,
                                        tableName: this.PAGE_APIURL,
                                        logSource: 'dashboard',
                                        object: this.PAGE_Data,
                                        oldObject: JSON.parse(this.oldData)
                                    });
                                } else {
                                    this.auth.logToServer({
                                        type: 'Add',
                                        agentId: this.auth.getUserId(),
                                        agentType: 'User',
                                        agentName: this.auth.getUser().fullName,
                                        tableName: this.PAGE_APIURL,
                                        logSource: 'dashboard',
                                        object: this.PAGE_Data,
                                    });
                                }

                                this.message.showSuccessAlert("با موفقیت ثبت شد");

                                this.route.navigate(["/dashboard/" + this.PAGE_URL]);


                            } else {
                                this.isUploading = false;
                                this.message.showMessageforFalseResult(data);
                                this.fileSize_MB = 0;
                            }

                            break;
                    }
                }),
                last()
            ).subscribe();

        } else {
            this.message.showWarningAlert("مقادیر خواسته شده را تکمیل نمایید");
        }
    }

    ngOnInit() {
    }

}

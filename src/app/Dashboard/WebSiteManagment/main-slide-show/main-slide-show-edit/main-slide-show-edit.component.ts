import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IMainSlideShow } from '../main-slide-show';
import { IPost } from '../../post/post';

@Component({
	selector: 'app-main-slide-show-edit',
	templateUrl: './main-slide-show-edit.component.html',
	styleUrls: ['./main-slide-show-edit.component.scss']
})
export class MainSlideShowEditComponent implements OnInit, OnDestroy {

	Title: string;
	btnTitle: string;
	isEdit: boolean = false;

    mainslideshow: IMainSlideShow;
    
    oldData = null;

	posts: IPost[] = [];

	@ViewChild("fm1", { static: false }) public fm1: NgForm;

	@ViewChild("d1", { static: false }) public d1;

	constructor(
		private route: Router,
		private activeRoute: ActivatedRoute,
		private message: MessageService,
		private auth: AuthService
	) {
		activeRoute.params.subscribe(params => {
			this.activeRoute.data.subscribe(data => {
				this.mainslideshow = data.mainslideshow;

				if (!this.mainslideshow.imgData) {
					this.mainslideshow.imgData = "";
                }
                
                this.oldData = JSON.stringify(data.mainslideshow);
			});

			var id = params["id"];

			if (id === "0") {
				this.Title = "افزودن اسلاید";
				this.btnTitle = "افزودن";
				this.isEdit = false;
			} else {
				var idd = Number.parseInt(id);
				if (Number.isInteger(idd)) {
					this.Title = "ویرایش اسلاید " + this.mainslideshow.name;
					this.btnTitle = "ویرایش";
					this.isEdit = true;
				} else {
					this.message.showWarningAlert("invalid Data");
					this.route.navigate(["/dashboard"]);
				}
			}
		});
    }
    
    ngOnDestroy(): void {
        let title = "mainslideshow";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.mainslideshow)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

	ngOnInit(): void {
		this.auth.post("/api/Post/getAll").subscribe((data: jsondata) => {
			if (data.success) {
				this.posts = data.data;
			} else {
				this.message.showMessageforFalseResult(data);
			}
		}, er => {
			this.auth.handlerError(er);
		});
	}

	openc(picker1) {
		picker1.open();
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

				this.mainslideshow.imgData = result;
				this.mainslideshow.imgName = file.name;
			};
		});
	}

	removePic() {
		this.d1.reset();
		this.mainslideshow.imgData = "";
		this.mainslideshow.imgName = "";
	}

	getFileUrl(url): string {
		return this.auth.apiUrl + url.substr(1);
	}

	sts() {
		if (this.fm1.valid) {
			if (this.isEdit) {
				this.auth.post("/api/MainSlideShow/Edit", this.mainslideshow, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'MainSlideShow',
                    logSource: 'dashboard',
                    object: this.mainslideshow,
                    oldObject: JSON.parse(this.oldData),
                    table: "MainSlideShow",
                    tableObjectIds: [this.mainslideshow.id]
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/mainslideshow"]);
						} else {
							this.message.showMessageforFalseResult(data);
						}
					},
					er => {
						this.auth.handlerError(er);
					}
				);
			} else {
				this.auth.post("/api/MainSlideShow/Add", this.mainslideshow, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'MainSlideShow',
                    logSource: 'dashboard',
                    object: this.mainslideshow,
                    table: "MainSlideShow",
                    tableObjectIds: [this.mainslideshow.id]
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/mainslideshow"]);
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

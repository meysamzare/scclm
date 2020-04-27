import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IAdvertising } from '../advertising';

@Component({
	selector: 'app-advertising-edit',
	templateUrl: './advertising-edit.component.html',
	styleUrls: ['./advertising-edit.component.scss']
})
export class AdvertisingEditComponent implements OnInit, OnDestroy {

	Title: string;
	btnTitle: string;
	isEdit: boolean = false;

    advertising: IAdvertising;
    
    oldData = null;

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
				this.advertising = data.advertising;
				if (!this.advertising.picData) {
					this.advertising.picData = "";
                }
                
                this.oldData = JSON.stringify(data.advertising);
			});

			var id = params["id"];

			if (id === "0") {
				this.Title = "افزودن تبلیغ";
				this.btnTitle = "افزودن";
				this.isEdit = false;
			} else {
				var idd = Number.parseInt(id);
				if (Number.isInteger(idd)) {
					this.Title = "ویرایش تبلیغ " + this.advertising.name;
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
        let title = "advertising";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.advertising)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

	sts() {
		if (this.fm1.valid) {
			if (this.isEdit) {
				this.auth.post("/api/Advertising/Edit", this.advertising, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Advertising',
                    logSource: 'dashboard',
                    object: this.advertising,
                    oldObject: JSON.parse(this.oldData),
                    table: "Advertising",
                    tableObjectIds: [this.advertising.id]
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/advertising"]);
						} else {
							this.message.showMessageforFalseResult(data);
						}
					},
					er => {
						this.auth.handlerError(er);
					}
				);
			} else {
				this.auth.post("/api/Advertising/Add", this.advertising, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Advertising',
                    logSource: 'dashboard',
                    object: this.advertising,
                    table: "Advertising",
                    tableObjectIds: [this.advertising.id]
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/advertising"]);
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


	setPic(files: File[]) {

		files.forEach(file => {
			if (file.size / 1024 / 1024 > 5) {
				this.d1.reset();
				return this.message.showWarningAlert(
					"حجم فایل باید کمتر از " + " پنج مگابایت " + " باشد",
					"اخطار"
				);
			}
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e: ProgressEvent) => {
				let result = reader.result.toString().split(",")[1];

				this.advertising.picData = result;
				this.advertising.picName = file.name;
			};
		});
	}

	removePic() {
		this.d1.reset();
		this.advertising.picData = "";
		this.advertising.picName = "";
	}


	getFileUrl(url): string {
		return this.auth.apiUrl + url.substr(1);
	}


	ngOnInit() {
	}

}

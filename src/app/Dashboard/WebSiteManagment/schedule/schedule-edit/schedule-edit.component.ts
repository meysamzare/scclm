import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { ISchedule } from '../schedule';
import { IPost } from '../../post/post';

@Component({
	selector: 'app-schedule-edit',
	templateUrl: './schedule-edit.component.html',
	styleUrls: ['./schedule-edit.component.scss']
})
export class ScheduleEditComponent implements OnInit, OnDestroy {

	Title: string;
	btnTitle: string;
	isEdit: boolean = false;

    schedule: ISchedule;
    
    oldData = null;

	posts: IPost[] = [];

	@ViewChild("fm1", { static: false }) public fm1: NgForm;
	@ViewChild("d1", { static: false }) public d1;

	constructor(
		private route: Router,
		private activeRoute: ActivatedRoute,
		private message: MessageService,
		public auth: AuthService
	) {
		activeRoute.params.subscribe(params => {
			this.activeRoute.data.subscribe(data => {
				this.schedule = data.schedule;
				if (!this.schedule.picData) {
					this.schedule.picData = "";
                }
                
                this.oldData = JSON.stringify(data.schedule);
			});

			var id = params["id"];

			if (id === "0") {
				this.Title = "افزودن رویداد";
				this.btnTitle = "افزودن";
				this.isEdit = false;
			} else {
				var idd = Number.parseInt(id);
				if (Number.isInteger(idd)) {
					this.Title = "ویرایش رویداد " + this.schedule.title;
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
        let title = "schedule";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.schedule)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

	openc(picker) {
		picker.open();
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

				this.schedule.picData = result;
				this.schedule.picName = file.name;
			};
		});
	}

	removePic() {
		this.d1.reset();
		this.schedule.picData = "";
		this.schedule.picName = "";
	}

	sts() {
		if (this.fm1.valid) {
			if (this.isEdit) {
				this.auth.post("/api/Schedule/Edit", this.schedule, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Schedule',
                    logSource: 'dashboard',
                    object: this.schedule,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/schedule"]);
						} else {
							this.message.showMessageforFalseResult(data);
						}
					},
					er => {
						this.auth.handlerError(er);
					}
				);
			} else {
				this.auth.post("/api/Schedule/Add", this.schedule, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Schedule',
                    logSource: 'dashboard',
                    object: this.schedule,
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/schedule"]);
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

}

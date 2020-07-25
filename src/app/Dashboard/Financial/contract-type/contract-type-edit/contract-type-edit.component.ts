import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IConstractType } from "../conrtact-type";

declare var $: any;
// declare var CKEDITOR: any;

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PictureSelectModalComponent } from "src/app/html-tools/picture-select-modal/picture-select-modal.component";
import { MatDialog } from "@angular/material";

@Component({
	selector: "app-contract-type-edit",
	templateUrl: "./contract-type-edit.component.html",
	styleUrls: ["./contract-type-edit.component.scss"]
})
export class ContractTypeEditComponent implements OnInit, OnDestroy {
	

	Title: string;
	btnTitle: string;
	isEdit: boolean = false;

    contrcttype: IConstractType;
    
    oldData = null;

	ckEditorConfig = {
		language: 'fa',
		autoParagraph: false
    };
    
    
    public Editor = ClassicEditor;
    public config = {
        language: {
            ui: 'fa',
            content: 'en'
        }
    };

	@ViewChild("fm1", { static: false }) public fm1: NgForm;

	constructor(
		private route: Router,
		private activeRoute: ActivatedRoute,
		private message: MessageService,
        private auth: AuthService,
        private dialog: MatDialog
	) {
		activeRoute.params.subscribe(params => {
			this.activeRoute.data.subscribe(data => {
                this.contrcttype = data.contracttype;
                
                this.oldData = JSON.stringify(data.contracttype);
			});

			var id = params["id"];

			if (id === "0") {
				this.Title = "افزودن نوع قرارداد";
				this.btnTitle = "افزودن";
				this.isEdit = false;
			} else {
				var idd = Number.parseInt(id);
				if (Number.isInteger(idd)) {
					this.Title = "ویرایش نوع قرارداد " + this.contrcttype.title;
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
		let title = "contrctType";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.contrcttype)
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

	addCommend(comd) {
		this.contrcttype.content += " " + comd;
	}

	sts() {
		if (this.fm1.valid) {
			if (this.isEdit) {
				this.auth.post("/api/ContractType/Edit", this.contrcttype, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Edit ConstractType',
                    logSource: 'dashboard',
                    object: this.contrcttype,
                    oldObject: JSON.parse(this.oldData),
                    table: "ContractType",
                    tableObjectIds: [this.contrcttype.id]
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/contracttype"]);
						} else {
							this.message.showMessageforFalseResult(data);
						}
					},
					er => {
						this.auth.handlerError(er);
					}
				);
			} else {
				this.auth.post("/api/ContractType/Add", this.contrcttype, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName:'Add ConstractType',
                    logSource: 'dashboard',
                    object: this.contrcttype,
                    table: "ContractType",
                    tableObjectIds: [this.contrcttype.id]
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/contracttype"]);
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
    
    insertPicture() {
        const dialog = this.dialog.open(PictureSelectModalComponent);

        dialog.afterClosed().subscribe(content => {
            if (content) {
                this.contrcttype.content += content
            }
        });
    }
}

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { IContract } from "../contract";
import { NgForm, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IConstractType, ContractTypeTable } from "../../contract-type/conrtact-type";

declare var $: any;

@Component({
	selector: "app-contract-edit",
	templateUrl: "./contract-edit.component.html",
	styleUrls: ["./contract-edit.component.scss"]
})
export class ContractEditComponent implements OnInit, AfterViewInit, OnDestroy {


	Title: string;
	btnTitle: string;
	isEdit: boolean = false;

    contrct: IContract;
    
    oldData = null;

	contractTypes: IConstractType[] = [];

	haveRelatedData = false;
	relatedData = [];
	relatedDataTitle = "";


	@ViewChild("fm1", { static: false }) public fm1: NgForm;

	constructor(
		private route: Router,
		private activeRoute: ActivatedRoute,
		private message: MessageService,
		private auth: AuthService
	) {
		activeRoute.params.subscribe(params => {
			this.activeRoute.data.subscribe(data => {
                this.contrct = data.contract;
                
                this.oldData = JSON.stringify(data.contract);

				if (!this.contrct.fileName) {
					this.contrct.fileName = "";
				}
			});

			var id = params["id"];

			if (id === "0") {
				this.Title = "افزودن قرارداد";
				this.btnTitle = "افزودن";
				this.isEdit = false;
			} else {
				var idd = Number.parseInt(id);
				if (Number.isInteger(idd)) {
					this.Title = "ویرایش قرارداد " + this.contrct.title;
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
        let title = "Contract";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.contrct)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

	ngOnInit() {
		this.auth.post("/api/ContractType/getAll").subscribe((data: jsondata) => {
			if (data.success) {
				this.contractTypes = data.data;

				if (this.isEdit) {
					this.getRelatedTable(this.contrct.contractTypeId, true);
				}
			} else {
				this.message.showMessageforFalseResult(data);
			}
		}, er => {
			this.auth.handlerError(er);
		});
	}

	ngAfterViewInit(): void {

	}


	getRelatedTable(conttypeid, isFirstLoad = false) {
		var conttype = this.contractTypes.find(c => c.id == conttypeid);

		if (conttype) {

			if (isFirstLoad == false) {
				this.contrct.partyContractId = null;
				this.contrct.partyContractName = "";
			}
			if (conttype.table == ContractTypeTable.Student) {
				this.getStudents();
			}
			if (conttype.table == ContractTypeTable.Person) {
				this.getPersons();
			}
			if (conttype.table == ContractTypeTable.Other) {
				this.haveRelatedData = false;
				this.relatedData = [];
				this.relatedDataTitle = "";
			}

		}
	}

	removeFile() {
		if (window.confirm("آیا از حذف این فایل اطمینان دارید؟")) {
			this.auth.post("/api/Contract/RemoveFile", this.contrct.id).subscribe((data: jsondata) => {
				if (data.success) {
					this.contrct.fileUrl = null;
				} else {
					this.message.showMessageforFalseResult(data);
				}
			}, er => {
				this.auth.handlerError(er);
			});
		}
	}

	getStudents() {
		this.haveRelatedData = true;
		this.relatedDataTitle = "دانش آموز";
		this.auth.post("/api/Student/getAll", null).subscribe(
			(data: jsondata) => {
				if (data.success) {
					this.relatedData = data.data;
				} else {
					this.message.showMessageforFalseResult(data);
				}
			},
			er => {
				this.auth.handlerError(er);
			}
		);
	}

	getPersons() {
		this.haveRelatedData = true;
		this.relatedDataTitle = "پرسنل";
		this.auth.post("/api/OrgPerson/getAll", null).subscribe(
			(data: jsondata) => {
				if (data.success) {
					this.relatedData = data.data;
				} else {
					this.message.showMessageforFalseResult(data);
				}
			},
			er => {
				this.auth.handlerError(er);
			}
		);
	}

	openc(picker) {
		picker.open();
	}


	onFileChanged(event) {
		let reader = new FileReader();
		if (event.target.files && event.target.files.length > 0) {
			let file = event.target.files[0];
			if (file.size / 1024 / 1024 > 5) {
				return this.message.showWarningAlert(
					"حجم فایل باید کمتر از 5 مگا بایت باشد",
					"اخطار"
				);
			}
			reader.readAsDataURL(file);
			reader.onload = () => {
				let result = reader.result.toString().split(",")[1];
				this.contrct.fileName = file.name;
				this.contrct.fileData = result;
			};
		} else {
			this.contrct.fileData = "";
			this.contrct.fileName = "";
		}
	}

	clearFile() {
		this.contrct.fileData = "";
		this.contrct.fileName = "";
	}


	getFileUrl(url): string {
		return this.auth.apiUrl + url.substr(1);
	}

	sts() {
		if (this.fm1.valid) {
			if (this.isEdit) {
				this.auth.post("/api/Contract/Edit", this.contrct, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Contract',
                    logSource: 'dashboard',
                    object: this.contrct,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/contract"]);
						} else {
							this.message.showMessageforFalseResult(data);
						}
					},
					er => {
						this.auth.handlerError(er);
					}
				);
			} else {
				this.auth.post("/api/Contract/Add", this.contrct, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName:'Contract',
                    logSource: 'dashboard',
                    object: this.contrct,
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/contract"]);
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

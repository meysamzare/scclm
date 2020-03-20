import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IStdPayment } from '../std-payment';
import { IPaymentType } from '../../payment-type/payment-type';
import { IStudent } from 'src/app/Dashboard/student/student';
import { IContract } from '../../contract/contract';

@Component({
	selector: 'app-std-payment-edit',
	templateUrl: './std-payment-edit.component.html',
	styleUrls: ['./std-payment-edit.component.scss']
})
export class StdPaymentEditComponent implements OnInit, OnDestroy {

	Title: string;
	btnTitle: string;
	isEdit: boolean = false;

    stdpayment: IStdPayment;
    
    oldData = null;

	paymentTypes: IPaymentType[] = [];
	students: IStudent[] = [];
	contracts: IContract[] = [];

	@ViewChild("fm1", { static: false }) public fm1: NgForm;

	constructor(
		private route: Router,
		private activeRoute: ActivatedRoute,
		private message: MessageService,
		private auth: AuthService
	) {
		activeRoute.params.subscribe(params => {
			this.activeRoute.data.subscribe(data => {
                this.stdpayment = data.stdpayment;
                
                this.oldData = JSON.stringify(data.stdpayment);
			});

			var id = params["id"];

			if (id === "0") {
				this.Title = "افزودن پرداخت دانش آموز";
				this.btnTitle = "افزودن";
				this.isEdit = false;
			} else {
				var idd = Number.parseInt(id);
				if (Number.isInteger(idd)) {
					this.Title = "ویرایش پرداخت دانش آموز " + this.stdpayment.studentFullName;
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
        let title = "stdpayment";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.stdpayment)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

	ngOnInit(): void {
		
		this.auth.post("/api/Student/getAll").subscribe((data: jsondata) => {
			if (data.success) {
				this.students = data.data;
			} else {
				this.message.showMessageforFalseResult(data);
			}
		}, er => {
			this.auth.handlerError(er);
		});

		this.auth.post("/api/PaymentType/getAll").subscribe((data: jsondata) => {
			if (data.success) {
				this.paymentTypes = data.data;
			} else {
				this.message.showMessageforFalseResult(data);
			}
		}, er => {
			this.auth.handlerError(er);
		});

		this.auth.post("/api/Contract/getAll").subscribe((data: jsondata) => {
			if (data.success) {
				this.contracts = data.data;
			} else {
				this.message.showMessageforFalseResult(data);
			}
		}, er => {
			this.auth.handlerError(er);
		});

	}


	sts() {
		if (this.fm1.valid) {
			if (this.isEdit) {
				this.auth.post("/api/StdPayment/Edit", this.stdpayment, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'StdPayment',
                    logSource: 'dashboard',
                    object: this.stdpayment,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/stdpayment"]);
						} else {
							this.message.showMessageforFalseResult(data);
						}
					},
					er => {
						this.auth.handlerError(er);
					}
				);
			} else {
				this.auth.post("/api/StdPayment/Add", this.stdpayment, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName:'StdPayment',
                    logSource: 'dashboard',
                    object: this.stdpayment,
                }).subscribe(
					(data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت ثبت شد");

							this.route.navigate(["/dashboard/stdpayment"]);
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

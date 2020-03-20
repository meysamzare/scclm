import { Component, OnInit, ViewChild, Input, ViewChildren, QueryList, AfterViewInit, ContentChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { DataFormComponent } from './data-form/data-form.component';

@Component({
    selector: 'app-data-edit',
    templateUrl: './data-edit.component.html',
    styleUrls: ['./data-edit.component.scss']
})
export class DataEditComponent implements OnInit, AfterViewInit {


    Title: string;
    btnTitle: string;

    @Input() PAGE_Data = null;
    oldData = null;
    
    @Input() RedirectToIndex: boolean = true;
    
    @Input() isEdit: boolean = false;
    @Input() PAGE_TITLE = "";
    @Input() PAGE_APIURL = "";
    @Input() PAGE_URL = "";

    @ContentChildren(DataFormComponent, { descendants: true }) public forms: QueryList<DataFormComponent>;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) { }

    ngOnInit() { 
        // this.activeRoute.data.subscribe(data => {
        //     this.PAGE_Data = data.data;

        //     this.oldData = JSON.stringify(data.data);
        // });

        if (!this.isEdit) {
            this.Title = "افزودن " + this.PAGE_TITLE;
            this.btnTitle = "افزودن";
        } else {
            this.Title = "ویرایش " + this.PAGE_TITLE + this.PAGE_Data.name;
            this.btnTitle = "ویرایش";
        }
    }

    
    ngAfterViewInit(): void {
    }


    isAllFormValid(): boolean {        

        if (this.forms) {
            return this.forms.toArray().every(c => c.isFormValid == true);
        }

        return false;
    }

    sts() {
        if (this.isAllFormValid()) {
            var isEditString = this.isEdit ? "Edit" : "Add";

            this.auth.post(`/api/${this.PAGE_APIURL}/${isEditString}`, this.PAGE_Data, {
                type: this.isEdit ? "Edit" : "Add",
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: this.PAGE_APIURL,
                logSource: 'dashboard',
                object: this.PAGE_Data,
                oldObject: this.isEdit ? JSON.parse(this.oldData) : null
            }).subscribe(data => {
                if (data.success) {
                    this.message.showSuccessAlert("با موفقیت ثبت شد");

                    if (this.RedirectToIndex) {
                        this.route.navigate(["/dashboard/" + this.PAGE_URL]);
                    }

                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        } else {
            this.message.showWarningAlert("مقادیر خواسته شده را تکمیل نمایید");
        }
    }

}

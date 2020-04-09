import { Component, OnInit, ViewChild, Input, ViewChildren, QueryList, AfterViewInit, ContentChildren, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { DataFormComponent } from './data-form/data-form.component';
import { MenuService } from '../../../services/menu/menu.service';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
    selector: 'app-data-edit',
    templateUrl: './data-edit.component.html',
    styleUrls: ['./data-edit.component.scss']
})
export class DataEditComponent implements OnInit, OnDestroy {


    Title: string;
    btnTitle: string;

    @Input() PAGE_Data = null;
    oldData = null;

    @Input() RedirectToIndex: boolean = true;

    @Input() PAGE_TITLE = "";
    @Input() PAGE_APIURL = "";
    @Input() PAGE_URL = "";


    @Input() nameProperty = "name";

    isEdit: boolean = false;

    get isAdd() {
        return !this.isEdit;
    }

    isSubmited = false;

    isLoading = false;

    @ContentChildren(DataFormComponent, { descendants: true }) public forms: QueryList<DataFormComponent>;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService,
        private menu: MenuService
    ) { }

    ngOnInit() {
        this.activeRoute.data.subscribe(data => {
            this.PAGE_Data = data.data;

            this.oldData = JSON.stringify(data.data);
        });


        if (!this.PAGE_TITLE) {
            this.PAGE_TITLE = this.menu.getCurrentPureUrl().title;
        }

        if (!this.PAGE_URL) {
            this.PAGE_URL = this.menu.getCurrentPureUrl().link;
        }

        if (!this.PAGE_APIURL) {
            this.PAGE_APIURL = this.menu.getCurrentPureUrl().apiUrl;
        }

        this.activeRoute.params.subscribe(params => {
            const id = params['id'];

            if (id === '0') {
                this.isEdit = false;
                this.Title = "افزودن " + this.PAGE_TITLE;
                this.btnTitle = "افزودن";
            } else {
                this.isEdit = true;
                this.Title = "ویرایش " + this.PAGE_TITLE + " " + this.PAGE_Data[this.nameProperty];
                this.btnTitle = "ویرایش";
            }
        });
    }


    ngOnDestroy(): void {
        let title = this.PAGE_APIURL;
        if (!this.isSubmited) {
            if (this.forms.toArray().some(c => c.isFormDirty()) && this.isAdd) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.PAGE_Data)
                });
            }
        } else {
            if (this.isAdd) {
                this.auth.draft.removeDraft(title)
            }
        }
    }


    isAllFormValid(): boolean {

        if (this.forms) {
            return this.forms.toArray().every(c => c.isFormValid);
        }

        return false;
    }

    sts() {
        if (this.isAllFormValid()) {

            this.isLoading = true;

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
            }).pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            ).subscribe(data => {
                if (data.success) {
                    this.message.showSuccessAlert("با موفقیت ثبت شد");

                    if (this.RedirectToIndex) {
                        this.route.navigate([`/${this.PAGE_URL}`]);
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

import { Component, ViewChild, AfterViewInit, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { IAttr } from '../attribute';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IUnit } from '../../unit/unit';
import { RoleClass } from '../../role/role';
import { MatChipInputEvent } from '@angular/material';
import { ITags } from '../../item/tags';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';

declare var $: any;

@Component({
    templateUrl: './attribute-edit.component.html',
    styles: [
        `
            div.di {
                pointer-events: none;
                opacity: 0.6;
            }
        `
    ]
})
export class AttributeEditComponent implements AfterViewInit, OnInit, AfterViewChecked, OnDestroy {

    Title: string;
    btnTitle: string;
    isEdit = false;

    attr: IAttr;

    oldData = null;

    catTree: string;

    tys: IUnit[] = [];

    values: ITags[] = [];

    attributes: IAttr[] = [];

    selectedCloneAttr: number = null;

    readonly separatorKeysCodes: number[] = [ENTER];

    parsedHtml;

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        public route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService,
        private sanitizer: DomSanitizer,
        public location: Location
    ) {
        this.activeRoute.params.subscribe(params => {
            const id = params['id'];

            if (id === '0') {
                this.attr = new IAttr();
                this.Title = 'افزودن فیلد';
                this.btnTitle = 'افزودن';
                this.isEdit = false;
            } else {
                const idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.auth.post('/api/Attribute/getAttribute', id).subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.attr = data.data;

                                this.oldData = JSON.stringify(data.data);

                                this.Title = 'ویرایش فیلد ' + this.attr.title;
                                this.btnTitle = 'ویرایش';
                                this.isEdit = true;
                                if (this.attr.attrTypeInt == 6 || this.attr.attrTypeInt == 10) {
                                    this.attr.values.split(',').forEach(st => {
                                        this.values.push({ name: st });
                                    });

                                    this.values.splice(0, 1);
                                }
                            } else {
                                this.message.showMessageforFalseResult(data);
                            }
                        },
                        er => {
                            this.auth.handlerError(er);
                        }
                    );
                } else {
                    this.message.showWarningAlert('invalid Data');
                    this.route.navigate(['/dashboard']);
                }
            }
        });
    }

    ngOnDestroy(): void {
        let title = "attribute";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.attr)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }


    async ngOnInit(): Promise<void> {
        this.auth.post('/api/Unit/GetAll', null).subscribe((data: jsondata) => {
            if (data.success) {
                this.tys = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        });
        this.auth.post('/api/Attribute/GetAll', null).subscribe((data: jsondata) => {
            if (data.success) {
                this.attributes = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        });

        let title = "attribute";
        if (await this.auth.draft.isAnyDraft(title)) {
            this.attr = JSON.parse((await this.auth.draft.getDraft(title)).value);
        }
    }

    cloneAttrChange() {
        let selectedAttrId = this.selectedCloneAttr;
        if (selectedAttrId) {
            this.auth.post('/api/Attribute/getAttribute', selectedAttrId).subscribe(data => {
                if (data.success) {
                    this.attr = data.data;

                    if (this.attr.attrTypeInt == 6 || this.attr.attrTypeInt == 10) {
                        this.attr.values.split(',').forEach(st => {
                            this.values.push({ name: st });
                        });
    
                        this.values.splice(0, 1);
                    }
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.values.push({ name: value.trim() });
        }

        if (input) {
            input.value = '';
        }
    }

    remove(tag: ITags): void {
        const index = this.values.indexOf(tag);

        if (index >= 0) {
            this.values.splice(index, 1);
        }
    }

    isCatSelected(): boolean {
        return this.attr.categoryId == null ? false : true;
    }

    isUnitSelected(): boolean {
        return this.attr.unitId == 0 ? false : true;
    }

    isTypeSelected(): boolean {
        return this.attr.attrTypeInt == 0 ? false : true;
    }

    goToList() {
        this.route.navigate(['/dashboard/attribute']);
    }

    sts() {
        if (this.fm1.valid) {
            if (this.attr.attrTypeInt == 6 || this.attr.attrTypeInt == 10) {
                this.attr.values = '';
                this.values.forEach(row => {
                    this.attr.values += ',' + row.name;
                });
            }

            if (this.isEdit) {
                this.auth.post('/api/Attribute/Edit', this.attr, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Attribute',
                    logSource: 'dashboard',
                    object: this.attr,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert('با موفقیت ثبت شد');

                            // this.route.navigate(['/dashboard/attribute']);
                            this.location.back();
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post('/api/Attribute/Add', this.attr, {
                    type: "Add",
                    agentId: this.auth.getUserId(),
                    agentType: "User",
                    agentName: this.auth.getUser().fullName,
                    tableName: "Attribute",
                    logSource: "dashboard",
                    object: this.attr
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert('با موفقیت ثبت شد');

                            // this.route.navigate(["/dashboard/attribute"]);
                            this.clearForm();
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
            this.message.showWarningAlert('مقادیر خواسته شده را تکمیل نمایید');
        }
    }

    clearForm() {
        this.attr.title = '';
        this.attr.attrTypeInt = null;
        this.attr.desc = '';
        this.attr.unitId = null;
        this.attr.values = '';
        this.values = [];
        this.attr.isUniq = false;
        this.attr.orderInt = null;
        this.attr.placeholder = "";
        this.attr.isRequired = false;
    }

    ngAfterViewChecked(): void {
        const sanitizerUr = (url) => {
            return this.auth.serializeUrl(url);
        };

        $('#divtree').jstree({
            plugins: ['wholerow', 'types'],
            core: {
                data: {
                    url: function (node) {
                        return node.id === '#'
                            ? sanitizerUr('/api/Category/GetTreeRoot')
                            : sanitizerUr('/api/Category/GetTreeChildren/' + node.id);
                    },
                    data: function (node) {
                        return { id: node.id };
                    }
                },
                strings: {
                    'Loading ...': 'لطفا اندکی صبر نمایید'
                },
                multiple: false
            },
            types: {
                default: {
                    icon: 'fa fa-folder'
                }
            }
        });
        
        
        $('#divtree').on('changed.jstree', (e, data) => {
            if (data.node) {
                this.attr.categoryId = data.node.id;
            }
        });

        $('#divtree').on('ready.jstree', () => {
            $('#divtree').jstree('open_all');
            $('#divtree').jstree(
                'select_node',
                '#' + this.attr.categoryId,
                true
            );
        });
        $('#divtree').on('loaded.jstree', () => {
            $('#divtree').jstree(
                'select_node',
                '#' + this.attr.categoryId,
                true
            );
        });

        $('#divtree').on('load_node.jstree', (e, n) => {
            if (n.node.id == this.attr.categoryId) {
                $('#divtree').jstree(
                    'select_node',
                    '#' + this.attr.categoryId,
                    true
                );
            }
        });
    }

    ngAfterViewInit(): void {

    }
}

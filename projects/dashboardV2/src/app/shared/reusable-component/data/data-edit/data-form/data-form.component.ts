import { Component, OnInit, Input, ViewChild, ContentChildren, QueryList, AfterViewInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

@Component({
    selector: 'app-data-form',
    templateUrl: './data-form.component.html',
    styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit, AfterViewInit {

    @Input() Id: string = "";

    @ContentChildren(NgModel, { descendants: true }) public models: QueryList<NgModel>;
    @ViewChild(NgForm, { static: true }) public form: NgForm;

    isFormValid = false;

    constructor() { }

    ngOnInit() { }

    public ngAfterViewInit(): void {
        let ngContentModels = this.models.toArray();
        ngContentModels.forEach((model) => {
            this.form.addControl(model);
        });

        this.form.valueChanges.subscribe(() => this.isFormValid = this.form.valid);
    }

    // isFormValid(): boolean {
    //     if (this.form) {
    //         return this.form.valid;
    //     }
    //     return false;
    // }

    public isFormDirty() {
        return this.form.dirty;
    }

}

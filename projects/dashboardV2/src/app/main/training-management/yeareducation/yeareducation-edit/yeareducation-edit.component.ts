import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataEditComponent } from 'projects/dashboardV2/src/app/shared/reusable-component/data/data-edit/data-edit.component';

@Component({
    selector: 'app-yeareducation-edit',
    templateUrl: './yeareducation-edit.component.html',
    styleUrls: ['./yeareducation-edit.component.scss']
})
export class YeareducationEditComponent implements OnInit, AfterViewInit {

    @ViewChild(DataEditComponent) dataEdit: DataEditComponent;

    constructor() { }

    ngAfterViewInit(): void {
        if (!this.dataEdit.PAGE_Data.desc) {
            this.dataEdit.PAGE_Data.desc = "";
        }
    }

    ngOnInit() {
    }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataEditComponent } from 'projects/dashboardV2/src/app/shared/reusable-component/data/data-edit/data-edit.component';
import { IFileInputReturn } from 'projects/dashboardV2/src/app/shared/reusable-component/input/file/file.component';

@Component({
    selector: 'app-student-edit',
    templateUrl: './student-edit.component.html',
    styleUrls: ['./student-edit.component.scss']
})
export class StudentEditComponent implements OnInit {

    @ViewChild(DataEditComponent) dataEdit: DataEditComponent;

    constructor() { }

    ngOnInit() {
    }

    onPicChange(result: IFileInputReturn) {
        if (result) {
            this.dataEdit.PAGE_Data.student.picData = result.value;
            this.dataEdit.PAGE_Data.student.picName = result.fileName;
        } else {
            this.dataEdit.PAGE_Data.student.picData = "";
            this.dataEdit.PAGE_Data.student.picName = "";
        }
    }

}

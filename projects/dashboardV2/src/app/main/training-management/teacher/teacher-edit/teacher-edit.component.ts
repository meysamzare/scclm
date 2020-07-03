import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-teacher-edit',
    templateUrl: './teacher-edit.component.html',
    styleUrls: ['./teacher-edit.component.scss']
})
export class TeacherEditComponent implements OnInit {

    orgPersons = [];

    constructor() { }

    ngOnInit() {
    }

}

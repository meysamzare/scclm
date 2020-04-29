import { Component, OnInit, ContentChildren, QueryList, Input } from '@angular/core';
import { DataIntroItemDirective } from './data-intro-item.directive';

@Component({
    selector: 'app-data-intro',
    templateUrl: './data-intro.component.html',
    styleUrls: ['./data-intro.component.scss']
})
export class DataIntroComponent implements OnInit {

    
    @Input() dataTitle = "";
    @Input() dataTitles = "";

    @Input() showAdd = true;
    @Input() addLink = "./edit/0";
    @Input() addTitle = "افزودن";
    @Input() addDesc = "";

    @Input() showList = true;
    @Input() listLink = "./list";
    @Input() listTitle = "لیست";
    @Input() listDesc = "";

    @ContentChildren(DataIntroItemDirective) items: QueryList<DataIntroItemDirective>;

    constructor() { }

    ngOnInit() {
    }

    getAddDesc(): string {
        if (this.addDesc) {
            return this.addDesc;
        }

        return `افزودن ${this.dataTitle} جدید`;
    }

    getListDesc(): string {
        if (this.listDesc) {
            return this.listDesc;
        }

        return `مشاهده لیست ${this.dataTitles}`;
    }

}

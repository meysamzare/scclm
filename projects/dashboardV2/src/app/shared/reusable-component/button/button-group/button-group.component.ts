import { Component, OnInit, ContentChildren, QueryList, Input, AfterContentInit } from '@angular/core';
import { ButtonDirective } from '../button.directive';

@Component({
    selector: 'app-button-group',
    templateUrl: './button-group.component.html',
    styleUrls: ['./button-group.component.scss']
})
export class ButtonGroupComponent implements OnInit, AfterContentInit {

    @Input() grouped = true;
    @Input() addons = false;
    @Input() center = false;

    @ContentChildren(ButtonDirective) public buttons: QueryList<ButtonDirective>;

    constructor() { }

    ngAfterContentInit(): void {
    }

    ngOnInit() {
    }

}

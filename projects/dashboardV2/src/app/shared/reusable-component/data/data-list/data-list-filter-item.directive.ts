import { Directive, Input, TemplateRef, ContentChild, AfterContentInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';

@Directive({
    selector: 'app-data-list-filter-item'
})
export class DataListFilterItemDirective implements AfterContentInit {

    @Input() title = "";
    @Input() name = "";
    @Input() type: "half" | "full" = "full";


    modelValue$ = new Subject<any>();

    @ContentChild(NgModel) public model: NgModel;

    constructor() { }

    ngAfterContentInit(): void {
        this.model.valueChanges.subscribe(value => this.modelValue$.next(value));
    }

    clearValue() {
        if (this.model) {
            this.model.valueAccessor.writeValue(null);
        }
    }

}

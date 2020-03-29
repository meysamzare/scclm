import { Directive, Input, OnInit, TemplateRef } from '@angular/core';

@Directive({
    selector: '[dataListItem]'
})
export class DataListItemDirective implements OnInit {


    public _title = "";
    @Input()
    set title(value: string) {
        this._title = value;
    }

    public _def = null;
    @Input()
    set def(value: string) {
        this._def = value;
    }

    public _sortHeader = true;
    @Input()
    set sortHeader(value: boolean) {
        this._sortHeader = value;
    }

    public _show = true;
    @Input()
    set show(value: boolean) {
        this._show = value;
    }

    constructor(
        public tempRef: TemplateRef<any>
    ) { }

    ngOnInit(): void {
    }

}


@Directive({
    selector: 'app-data-list-actions'
})
export class DataListActionsDirective { }

@Directive({
    selector: 'app-data-list-opration'
})
export class DataListOprationDirective { }

@Directive({
    selector: 'app-data-list-delete-opration'
})
export class DataListDeleteOprationDirective { }
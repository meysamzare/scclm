import { Directive, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[double-click]'
})
export class DoubleClickDirective implements OnInit, OnDestroy {

    @Output() doubleClick = new EventEmitter();
    private clicks = new Subject();
    private subscription;

    constructor() { }

    ngOnInit() {
        this.subscription = this.clicks
            .pipe(debounceTime(500))
            .subscribe(e => this.doubleClick.emit(e));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event'])
    clickEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
}

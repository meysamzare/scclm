import { NgModule } from '@angular/core';

import {
    BsDropdownModule, AccordionModule, AlertModule, ButtonsModule, CarouselModule, CollapseModule, BsDatepickerModule,
    ModalModule, PaginationModule, PopoverModule, ProgressbarModule, RatingModule, SortableModule, TabsModule, TimepickerModule,
    TooltipModule, TypeaheadModule
} from 'ngx-bootstrap';


@NgModule({
    declarations: [],
    imports: [
        BsDropdownModule.forRoot(),
        AccordionModule.forRoot(),
        AlertModule.forRoot(),
        ButtonsModule.forRoot(),
        CarouselModule.forRoot(),
        CollapseModule.forRoot(),
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        PopoverModule.forRoot(),
        ProgressbarModule.forRoot(),
        RatingModule.forRoot(),
        SortableModule.forRoot(),
        TabsModule.forRoot(),
        TimepickerModule.forRoot(),
        TooltipModule.forRoot(),
        TypeaheadModule.forRoot(),
    ],
    exports: [
        BsDropdownModule,
        AccordionModule,
        AlertModule,
        ButtonsModule,
        CarouselModule,
        CollapseModule,
        ModalModule,
        PaginationModule,
        PopoverModule,
        ProgressbarModule,
        RatingModule,
        SortableModule,
        TabsModule,
        TimepickerModule,
        TooltipModule,
        TypeaheadModule,
    ]
})
export class BootstrapModule { }

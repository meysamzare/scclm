import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DividerComponent } from './divider/divider.component';
import { MenuItemComponent } from './menu/menu-item/menu-item.component';
import { MenuItemParentDirective } from './menu/menu-item/menu-item-parent.directive';
import { DataEditComponent } from './data/data-edit/data-edit.component';
import { DataListComponent } from './data/data-list/data-list.component';
import { DataFormComponent } from './data/data-edit/data-form/data-form.component';
import { DataFormButtonsDirective } from './data/data-edit/data-form/data-form.directive';
import { DataEditHeaderDirective } from './data/data-edit/data-edit.directive';
import { DataListItemDirective, DataListActionsDirective, DataListDeleteOprationDirective, DataListOprationDirective } from './data/data-list/data-list-item.directive';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MaterialModule } from 'src/app/shared/material.module';
import { RouterModule } from '@angular/router';
import { MenuListItemDirective } from './menu/menu-item/menu-list-item.directive';
import { CardComponent } from './card/card.component';
import { TextareaComponent } from './input/textarea/textarea.component';
import { MessageComponent } from './message/message.component';
import { ButtonComponent } from './button/button.component';
import { ButtonGroupComponent } from './button/button-group/button-group.component';
import { ButtonDirective } from './button/button.directive';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SelectComponent } from './select/select.component';
import { SelectOptionDirective } from './select/select-option.directive';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadioComponent } from './radio/radio.component';
import { RadioButtonDirective } from './radio/radio-button.directive';
import { FileComponent } from './input/file/file.component';
import { ColsComponent } from './Layout/cols/cols.component';
import { ColComponent } from './Layout/cols/col/col.component';
import { IconComponent } from './Layout/icon/icon.component';
import { MatPaginatorIntl, MatDatepickerIntl, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MatPaginatorIntlCro } from 'src/app/shared/paginationInit';
import { MatDatePickerInit, MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from 'src/app/shared/persianDateInit';
import { HaveAccessDirective } from './directives/have-access.directive';
import { DataListFilterItemDirective } from './data/data-list/data-list-filter-item.directive';
import { DataIntroComponent } from './data/data-intro/data-intro.component';
import { DataIntroItemDirective } from './data/data-intro/data-intro-item.directive';
import { NavbarComponent, NavbarItemDirective } from '../../main/navbar/navbar.component';
import { MenuIntroComponent } from './data/data-intro/menu-intro/menu-intro.component';
import { TreeComponent } from './tree/tree.component';
import { LongPressDirective } from './directives/long-press.directive';
import { TreeDialogComponent } from './tree/tree-dialog/tree-dialog.component';
import { DateInputComponent } from './input/date-input/date-input.component';


@NgModule({
    declarations: [
        InputComponent,
        DividerComponent,
        MenuItemComponent,
        MenuListItemDirective,
        MenuItemParentDirective,
        DataEditComponent,
        DataListComponent,
        DataFormComponent,
        DataFormButtonsDirective,
        DataEditHeaderDirective,
        DataListItemDirective,
        DataListActionsDirective,
        CardComponent,
        TextareaComponent,
        MessageComponent,
        ButtonComponent,
        ButtonGroupComponent,
        ButtonDirective,
        SelectComponent,
        SelectOptionDirective,
        CheckboxComponent,
        RadioComponent,
        RadioButtonDirective,
        FileComponent,
        ColsComponent,
        ColComponent,
        IconComponent,
        HaveAccessDirective,
        DataListFilterItemDirective,
        DataIntroComponent,
        DataIntroItemDirective,
        NavbarComponent,
        NavbarItemDirective,
        MenuIntroComponent,
        TreeComponent,
        LongPressDirective,
        TreeDialogComponent,
        DateInputComponent,
        DataListOprationDirective,
        DataListDeleteOprationDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SweetAlert2Module.forRoot(),
        MaterialModule,
        RouterModule,
        NgxMatSelectSearchModule,
    ],
    exports: [
        InputComponent,
        DividerComponent,
        MenuItemComponent,
        MenuListItemDirective,
        MenuItemParentDirective,
        DataEditComponent,
        DataListComponent,
        DataFormComponent,
        DataFormButtonsDirective,
        DataEditHeaderDirective,
        DataListItemDirective,
        DataListActionsDirective,
        CardComponent,
        TextareaComponent,
        MessageComponent,
        ButtonComponent,
        ButtonGroupComponent,
        ButtonDirective,
        SelectComponent,
        SelectOptionDirective,
        CheckboxComponent,
        RadioComponent,
        RadioButtonDirective,
        FileComponent,
        ColsComponent,
        ColComponent,
        IconComponent,
        HaveAccessDirective,
        DataListFilterItemDirective,
        DataIntroComponent,
        DataIntroItemDirective,
        NavbarComponent,
        NavbarItemDirective,
        MenuIntroComponent,
        TreeComponent,
        LongPressDirective,
        TreeDialogComponent,
        DateInputComponent,
        DataListOprationDirective,
        DataListDeleteOprationDirective
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
        { provide: MatDatepickerIntl, useClass: MatDatePickerInit },
        {
            provide: DateAdapter,
            useClass: MaterialPersianDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
    ]
})
export class ReusableComponentModule { }

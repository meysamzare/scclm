import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { TooltipModule } from 'ngx-bootstrap';
import { HtmlToolsModule } from 'src/app/html-tools/html-tools.module';
import { SetItemAttributeScoreComponent } from 'src/app/Dashboard/item/list/set-item-attribute-score/set-item-attribute-score.component';
import { ShowImageComponent } from 'src/app/shared/Modal/show-image.component';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        ItemDetailComponent,
        SetItemAttributeScoreComponent,
        ShowImageComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        TooltipModule,
        FormsModule,
        HtmlToolsModule
    ],
    exports: [ItemDetailComponent],
    entryComponents: [
        ShowImageComponent,
        SetItemAttributeScoreComponent
    ]
})
export class CustomFormToolsModule { }

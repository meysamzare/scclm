import { NgModule } from "@angular/core";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from "./material.module";
import { MessageService } from "./services/message.service";
import { FormsModule } from "@angular/forms";


@NgModule({
    imports: [
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule
    ],
    providers: [
        MessageService
    ]
})
export class SharedModule{

}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginMessagesComponent } from './login-messages/login-messages.component';



@NgModule({
    declarations: [
        LoginMessagesComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LoginMessagesComponent
    ]
})
export class LoginMessagesModule { }

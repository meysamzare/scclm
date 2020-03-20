import { Component, OnInit } from '@angular/core';
import { ICustomMessage } from './custom-message';
import { CustomMessageService } from './custom-message.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-custom-message',
    templateUrl: './custom-message.component.html',
    styleUrls: ['./custom-message.component.scss'],
    animations: [
        trigger(
            "enterAnim", [
                transition(":enter", [
                    style({ transform: 'translateY(100%)', opacity: 0 }),
                    animate('250ms', style({ transform: 'translateY(0)', opacity: 1 }))
                ]),
                transition(":leave", [
                    style({ transform: 'translateY(0)', opacity: 1 }),
                    animate('250ms', style({ transform: 'translateY(100%)', opacity: 0 }))
                ])
            ]
        )
    ]
})
export class CustomMessageComponent implements OnInit {

    customMessages: ICustomMessage[];

    constructor(
        private customService: CustomMessageService
    ) {

        this.customMessages = new Array<ICustomMessage>();

        this.customService.messageAdded.subscribe(customMessage => {

            var cm = this.customMessages.find(c => c.message.trim() == customMessage.message.trim());

            let timeOut = customMessage.message.length * 170;

            if (cm) {
                cm.count += 1;
            } else {
                this.customMessages.push(customMessage);

                setTimeout(() => {
                    this.hide.bind(this)(customMessage)
                }, timeOut);
            }
        });

        this.customService.clearAll$.subscribe(() => {
            this.customMessages = [];
        });
    }

    ngOnInit() { }


    hide(cm) {
        let index = this.customMessages.indexOf(cm);

        if (index >= 0) {
            this.customMessages.splice(index, 1);
        }
    }

}

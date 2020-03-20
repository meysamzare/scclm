import { Component, OnInit } from '@angular/core';
import { CustomMessageService } from 'src/app/shared/components/custom-message/custom-message.service';
import { ICustomMessage } from 'src/app/shared/components/custom-message/custom-message';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-mobile-message',
    templateUrl: './mobile-message.component.html',
    styleUrls: ['./mobile-message.component.scss'],
    animations: [
        trigger(
            "enterAnim", [
                transition(":enter", [
                    style({ transform: 'translateX(100%)', opacity: 0 }),
                    animate('250ms', style({ transform: 'translateX(0)', opacity: 1 }))
                ]),
                transition(":leave", [
                    style({ transform: 'translateX(0)', opacity: 1 }),
                    animate('250ms', style({ transform: 'translateX(100%)', opacity: 0 }))
                ])
            ]
        )
    ]
})
export class MobileMessageComponent implements OnInit {

    customMessages: ICustomMessage[] = [];

    constructor(
        private customService: CustomMessageService
    ) {

        this.customMessages = new Array<ICustomMessage>();

        this.customService.messageAdded.subscribe(customMessage => {

            var cm = this.customMessages.find(c => c.message.trim() == customMessage.message.trim());

            if (cm) {
                cm.count += 1;
            } else {
                this.customMessages.push(customMessage);

                setTimeout(() => {
                    this.hide.bind(this)(customMessage)
                }, 4000);

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

import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ICustomMessage } from 'src/app/shared/components/custom-message/custom-message';
import { CustomMessageService } from 'src/app/shared/components/custom-message/custom-message.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    animations: [
        trigger(
            "enterAnim", [
                transition(":enter", [
                    style({ transform: 'translateY(100%)', opacity: 0 }),
                    animate('110ms', style({ transform: 'translateY(0)', opacity: 1 }))
                ]),
                transition(":leave", [
                    style({ transform: 'translateY(0)', opacity: 1 }),
                    animate('110ms', style({ transform: 'translateY(100%)', opacity: 0 }))
                ])
            ]
        )
    ]
})
export class MessageComponent implements OnInit {

    messages: ICustomMessage[] = [];

    constructor(
        private customService: CustomMessageService
    ) {
        
        this.customService.messageAdded.subscribe(customMessage => {

            var message = this.messages.find(c => c.message.trim() == customMessage.message.trim());

            let timeOut = customMessage.message.length * 130;

            if (message) {
                message.count += 1;
            } else {
                this.messages.push(customMessage);

                setTimeout(() => {
                    this.hide.bind(this)(customMessage)
                }, timeOut);
            }
        });

        this.customService.clearAll$.subscribe(() => {
            this.messages = [];
        });
    }

    ngOnInit() {
    }

    hide(message) {
        let index = this.messages.indexOf(message);

        if (index >= 0) {
            this.messages.splice(index, 1);
        }
    }
}

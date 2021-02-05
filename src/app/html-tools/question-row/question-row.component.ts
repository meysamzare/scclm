import { Component, Input, OnInit } from '@angular/core';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { IAttributeOption } from 'src/app/Dashboard/attribute/attribute-option';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-question-row',
    templateUrl: './question-row.component.html',
    styleUrls: ['./question-row.component.scss']
})
export class QuestionRowComponent implements OnInit {

    @Input() question: IAttr | any = null;
    @Input() questionId: number = null;

    @Input() canEditTrueOption = false;

    constructor(
        private auth: AuthService
    ) { }

    ngOnInit() {
        Promise.resolve().then(() => {
            Object.keys(this.question).forEach(key => {
                if (key.startsWith("question")) {
                    const newKey = key.replace("question", "");
                    delete Object.assign(this.question, { [newKey]: this.question[key] })[key];
                }
            });
        });
    }


    getShiftedItem(attr: any) {
        const options: IAttributeOption[] = ((attr.attributeOptions) ? attr.attributeOptions : attr.options) || [];

        return options;
    }

    setIsTrueQuestionOption(option) {
        if (this.canEditTrueOption) {

            option.questionId = this.questionId;
            option.isTrue = false;



            this.auth.post("/api/Question/SetTrueOption", option).subscribe(data => {
                if (data.success) {
                    try {
                        (this.question.attributeOptions || this.question.options).forEach(option => {
                            option.isTrue = false;
                        });
                        (this.question.attributeOptions || this.question.options).find(c => c == option).isTrue = true;
                    } catch { }
                    this.auth.message.showSuccessAlert("با موفقیت ثبت شد");
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export interface ObData {
    complate: boolean;
    data: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
    speechRecognition: SpeechRecognition;

    constructor() { }

    commands = [
        "کاما",
        "علامت سوال",
        "دو نقطه",
        "نقطه",
        "علامت تعجب"
    ];

    replacement = [
        "،",
        "؟",
        ":",
        ".",
        "!"
    ];

    stop(): void {
        this.speechRecognition.stop();
    }

    record(): Observable<ObData> {

        return new Observable(observer => {
            const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
            this.speechRecognition = new webkitSpeechRecognition();

            this.speechRecognition.continuous = true;
            this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'fa-ir';
            this.speechRecognition.maxAlternatives = 1;

            this.speechRecognition.onresult = speech => {
                let term: string = "";

                for (let i = speech.resultIndex; i < speech.results.length; ++i) {
                    let val = speech.results[i][0].transcript;
                    if (speech.results[i].isFinal) {
                        term = val.trim();
                        observer.next({ complate: true, data: term });
                        // this.zone.run(() => {
                        // });
                    } else {
                        observer.next({ complate: false, data: val });
                    }
                }

                // if (speech.results) {
                //   let result = speech.results[speech.resultIndex];
                //   let transcript = result[0].transcript;
                //   if (result.isFinal) {
                //     if (result[0].confidence < 0.3) {
                //       console.log("Unrecognized result - Please try again");
                //     }
                //     else {
                //       term = _.trim(transcript);

                //     }
                //   }else{
                //     observer.next({complate: false , data: transcript});
                //   }
                // }

            };

            this.speechRecognition.onerror = error => {
                observer.error(error);
            };

            this.speechRecognition.onend = () => {
                observer.complete();
            };

            this.speechRecognition.start();
            
        });
    }

    DestroySpeechObject() {
        if (this.speechRecognition)
            this.speechRecognition.stop();
    }
}

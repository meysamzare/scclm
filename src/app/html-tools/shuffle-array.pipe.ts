import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shuffleArray'
})
export class ShuffleArrayPipe implements PipeTransform {

    transform(value: any[], ...args: any[]): any {
        if (args[0]) {   
            return this.shuffleArray(value);
        }

        return value;
    }

    
    shuffleArray(array: any[]) {

        let shuffled = array
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)

        return shuffled;
    }

}
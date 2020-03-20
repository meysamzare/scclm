import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    locationHistory: string[] = [];

    constructor(
        private location: Location
    ) { 
        location.onUrlChange(url => {
            this.locationHistory.unshift(url);
        });
    }

    canGoBack() {
        return this.locationHistory.length == 0 ? false : true;
    }

    back() {
        this.location.back();
    }
}
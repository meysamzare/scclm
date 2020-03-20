import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

import { LoaderService } from "./loader.service";

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
    
    constructor(
        private loader: LoaderService
    ) { }
    
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        this.loader.setState(true);
        
        // const updatedRequest = request.clone({
        //     headers: request.headers.set("Authorization", "Some-dummyCode")
        // });
        
        return next.handle(request).pipe(
            tap(
                event => {
                    
                    if (event instanceof HttpResponse) {
                        this.loader.setState(false);
                    }
                },
                error => {
                    this.loader.setState(false);
                    if (event instanceof HttpResponse) {
                        
                    }
                }
            )
        );
    }
}
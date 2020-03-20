import { Component } from "@angular/core";



@Component({
    template: `
    <body class="gray-bg">
        <div class="middle-box text-center animated fadeInDown">
            <h1>404</h1>
            <h3 class="font-bold">صفحه مورد نظر پیدا نشد</h3>

            <div class="error-desc">
                متاسفانه صفحه ای که دنبال آن بودید پیدا نشد، لطفا مجددا تلاش فرمایید
            </div>

            <button class="btn" mat-button color="primary" [routerLink]="['/']">بازگشت</button>

        </div>
    </body>
    `
})
export class NotfoundComponent{

}
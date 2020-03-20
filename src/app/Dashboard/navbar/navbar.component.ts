import { Component, AfterViewInit, OnDestroy, OnInit } from "@angular/core";

declare var $:any;

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements AfterViewInit, OnDestroy, OnInit{
    
    ngAfterViewInit(): void {
        
        // Minimalize menu
        $('.navbar-minimalize').on('click', function () {
            $("body").toggleClass("mini-navbar");
            SmoothlyMenu();


        });

        function SmoothlyMenu() {
            if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                // Hide menu in order to smoothly turn on when maximize menu
                $('#side-menu').hide();
                // For smoothly turn on menu
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(400);
                    }, 200);
            } else if ($('body').hasClass('fixed-sidebar')) {
                $('#side-menu').hide();
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(400);
                    }, 100);
            } else {
                // Remove all inline style from jquery fadeIn function to reset menu state
                $('#side-menu').removeAttr('style');
            }
        }
    }

    ngOnInit(): void {
        var bodys = $("body").toArray();

        bodys.forEach(body => {
            $(body).removeClass("mini-navbar");
        });
    }
    
    ngOnDestroy(): void {
        var bodys = $("body").toArray();

        bodys.forEach(body => {
            $(body).removeClass("mini-navbar");
        });
    }

    closeSideBar() {
        var bodys = $("body").toArray();

        bodys.forEach(body => {
            $(body).toggleClass("mini-navbar");
        });
    }

}
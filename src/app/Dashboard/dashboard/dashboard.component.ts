import { Component, OnInit, AfterViewInit } from "@angular/core";
import { SignalRService } from "src/app/shared/services/signalr.service";

declare var $: any;
declare var jQuery: any;

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit, AfterViewInit {
    ngAfterViewInit(): void {
        jQuery(window).bind("load", function () {
            correctHeight();
            detectBody();
        });

        // Correct height of wrapper after metisMenu animation.
        jQuery(".metismenu a").click(() => {
            setTimeout(() => {
                correctHeight();
            }, 300);
        });

        $('#side-menu').metisMenu({
            toggle: true
        })



        // Collapse ibox function
        $('.collapse-link').on('click', function () {
            var ibox = $(this).closest('div.ibox');
            var button = $(this).find('i');
            var content = ibox.children('.ibox-content');
            content.slideToggle(200);
            button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
            ibox.toggleClass('').toggleClass('border-bottom');
            setTimeout(function () {
                ibox.resize();
                ibox.find('[id^=map-]').resize();
            }, 50);
        });


        // Open close right sidebar
        $('.right-sidebar-toggle').on('click', function () {
            $('#right-sidebar').toggleClass('sidebar-open');
        });

        // Minimalize menu
        $('.navbar-minimalize').on('click', function () {
            $("body").toggleClass("mini-navbar");
            SmoothlyMenu();


        });
        
        if (screen.width < 769) {
            jQuery('body').addClass('body-small')
        } else {
            jQuery('body').removeClass('body-small')
        }
        

        function WinMove() {
            var element = "[class*=col]";
            var handle = ".ibox-title";
            var connect = "[class*=col]";
            $(element).sortable({
                handle: handle,
                connectWith: connect,
                tolerance: 'pointer',
                forcePlaceholderSize: true,
                opacity: 0.8
            })
                .disableSelection();
        }

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

    constructor(private signalRservice: SignalRService) { }

    ngOnInit(): void {
        this.signalRservice.startConnection();


        this.signalRservice.startConnectionForUser();


    }

    public logoutSignalRFunction() {
        this.signalRservice.stopConnectionUser();
    }
}

export function correctHeight() {
    var pageWrapper = jQuery("#page-wrapper");
    var navbarHeight = jQuery("nav.navbar-default").height();
    var wrapperHeigh = pageWrapper.height();

    if (navbarHeight > wrapperHeigh) {
        pageWrapper.css("min-height", navbarHeight + "px");
    }

    if (navbarHeight < wrapperHeigh) {
        if (navbarHeight < jQuery(window).height()) {
            pageWrapper.css("min-height", jQuery(window).height() + "px");
        } else {
            pageWrapper.css("min-height", navbarHeight + "px");
        }
    }

    if (jQuery("body").hasClass("fixed-nav")) {
        if (navbarHeight > wrapperHeigh) {
            pageWrapper.css("min-height", navbarHeight + "px");
        } else {
            pageWrapper.css("min-height", jQuery(window).height() - 60 + "px");
        }
    }
}

export function detectBody() {
    if (jQuery(document).width() < 769) {
        jQuery("body").addClass("body-small");
    } else {
        jQuery("body").removeClass("body-small");
    }
}

export function smoothlyMenu() {
    if (
        !jQuery("body").hasClass("mini-navbar") ||
        jQuery("body").hasClass("body-small")
    ) {
        // Hide menu in order to smoothly turn on when maximize menu
        jQuery("#side-menu").hide();
        // For smoothly turn on menu
        setTimeout(function () {
            jQuery("#side-menu").fadeIn(400);
        }, 200);
    } else if (jQuery("body").hasClass("fixed-sidebar")) {
        jQuery("#side-menu").hide();
        setTimeout(function () {
            jQuery("#side-menu").fadeIn(400);
        }, 100);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        jQuery("#side-menu").removeAttr("style");
    }
}

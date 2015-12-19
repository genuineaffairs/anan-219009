/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for sending gift to a friend
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.champion.sendGift', [
            'ngRoute',
            'app.components',
            'ui.bootstrap'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    //send gift route config
    function config($routeProvider) {
        $routeProvider
            .when("/send-gift/:giftCardId", {
                templateUrl: "champion/send-gift/send-gift.html",
                controller: 'SendGiftCtrl',
                resolve: {
                    giftCard: SendGiftResolve,
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'Gifting',
                            cancel: 'founder-shares',
                            showMenu: true
                        }
                    }
                }
            })
	    .when("/FounderF$Gifting/:giftCardId", {
		redirectTo: function(params) {
		    return "/send-gift/"+params.giftCardId;
		}
	    });
    }

    SendGiftResolve.$inject = ['$route', 'GiftCardService'];
    //function to get the relevant data for send gift card page and inject into the controller
    function SendGiftResolve($route, GiftCardService) {
            return GiftCardService.getMyGiftCard($route.current.params.giftCardId);
    }

})();


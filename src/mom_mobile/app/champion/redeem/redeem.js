/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for champion redeem page
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Change global option from back to cancel
 */

(function () {
    'use strict';

    angular
        .module('app.champion.redeem', [
            'ngRoute',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/redeem/:id', {
                templateUrl: 'champion/redeem/redeem.html',
                controller: 'ChampionRedeemCtrl',
                resolve: {
                    DATA:['$route', 'GiftCardService',
                        function ($route, GiftCardService) {
                            return GiftCardService.getMyGiftCard($route.current.params.id);
                        }],
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'Display QR',
                            cancel: 'founder-shares'
                        }
                    }
                }
            })
    }

})();


/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for individual my foundershares page
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Modified file name and route from champion-home to founder-shares.
 *  - Included global options showMenu.
 *  - Modified global options to change the title of the page.
 *  - Modified the name of the controller from ChampionHomeCtrl to FounderSharesCtrl
 */

(function () {
    'use strict';

    angular
        .module('app.champion.founderShares', [
            'ngRoute',
            'slick',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    //Founder shares route config
    function config($routeProvider) {
        $routeProvider
            .when('/founder-shares', {
                templateUrl: 'champion/founder-shares/founder-shares.html',
                controller: 'FounderSharesCtrl',
                resolve: {
                    DATA: ['GiftCardService',
                        function (GiftCardService) {
                            return GiftCardService.getMyGiftCards({pageNumber: 0});
                        }],
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'My Founder$hares',
                            showMenu: true
                        }
                    }
                }
            });
    }
})();
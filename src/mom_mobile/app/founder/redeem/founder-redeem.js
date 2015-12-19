/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for founder redeem
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included global options showMenu
 */

(function () {
    'use strict';

    angular
        .module('app.founder.redeem', [
            'ngRoute',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/founder-redeem',{
                templateUrl: 'founder/redeem/founder-redeem.html',
                controller: 'FounderRedeemCtrl',
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'Redeem Founder$hares',
                            showMenu: true
                        }
                    }
                }
            })
    }

})();


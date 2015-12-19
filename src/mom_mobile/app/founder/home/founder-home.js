/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for founder home page
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes to 1.1
 *  - Included global options showMenu
 */

(function () {
    'use strict';

    angular
        .module('app.founder.home', [
            'ngRoute'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/founder-home',{
                templateUrl: 'founder/home/founder-home.html',
                controller: "FounderHomeCtrl",
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

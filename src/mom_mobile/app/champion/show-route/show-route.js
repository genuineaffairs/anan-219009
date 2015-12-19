/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for show route page
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.champion.showRoute', [
            'ngRoute',
            'ng.deviceDetector',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    //route configuration for show route page
    function config($routeProvider) {
        $routeProvider
            .when('/show-route', {
                templateUrl: 'champion/show-route/show-route.html',
                controller: 'ShowRouteCtrl',
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'Route',
                            close: true,
                            start: true
                        }
                    }
                }
            })
    }

})();


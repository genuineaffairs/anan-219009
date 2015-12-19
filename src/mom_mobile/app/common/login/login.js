/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for login page
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Change the route from root to /login
 */

(function () {
    'use strict';

    angular
        .module('app.common.login', [
            'ngRoute',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'common/login/login.html',
                controller: 'LoginCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: true,
                            title: 'FounderShare'
                        }
                    }
                }
            })
    }
})();


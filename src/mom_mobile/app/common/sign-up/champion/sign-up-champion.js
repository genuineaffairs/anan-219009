/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for champion sign up page
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.common.signUp')
        .config(config);


    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/sign-up-champion',{
                templateUrl: 'common/sign-up/champion/sign-up-champion.html',
                controller:'SignUpChampionCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: true,
                            title: 'Sign Up - Champion'
                        }
                    }
                }
            })
    }

})();


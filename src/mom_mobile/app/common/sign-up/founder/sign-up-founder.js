/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for founder sign up page
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
            .when('/sign-up-founder',{
                templateUrl: 'common/sign-up/founder/sign-up-founder.html',
                controller:'SignUpFounderCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: true,
                            title: 'Sign Up - Founder'
                        }
                    }
                }
            })
    }

})();


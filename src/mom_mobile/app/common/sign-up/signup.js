/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for choose signup page
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.common.signUp', [
            'ngRoute',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/sign-up-choose-account-type',{
                templateUrl: 'common/sign-up/sign-up-choose-account-type.html',
                controller: 'SignUpChooseAccountCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: true,
                            title: 'Sign Up - Choose'
                        }
                    }
                }
            })
    }

})();

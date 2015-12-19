/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for reset password
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.common.resetPassword', [
            'ngRoute',
            'app.components'
        ])
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/reset-password',{
                templateUrl: 'common/reset-password/reset-password-step-1.html',
                controller:'ResetPasswordCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: true,
                            title: 'Forgot Password'
                        }
                    }
                }
            })
            .when('/ResetPassword',{
                templateUrl: 'common/reset-password/reset-password-step-2.html',
                controller:'ResetPasswordStepTwoCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: true,
                            title: 'Change Password'
                        }
                    }
                }
            })
    }
})();

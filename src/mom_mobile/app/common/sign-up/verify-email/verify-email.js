/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for verify email page
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
            .when("/VerifyEmail/:userId/:token", {
                templateUrl: "common/sign-up/verify-email/verify-email.html",
                controller: 'VerifyEmailCtrl',
                isPublic: true
            })
    }

})();


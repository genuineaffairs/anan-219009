/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents services.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('SecurityService', SecurityService);

    SecurityService.$inject = ['CommonService', 'appConfig'];

    function SecurityService(CommonService, appConfig) {
        var service = {};
        /**
         *
         * Authenticate the user using password type.
         * @param email the user email
         * @param password the user password
         */
        service.authenticate = function (email, password) {
            var req = {
                method: 'POST',
                url: '/login?type=PASSWORD',
                data: {
                    email: email,
                    password: password
                }
            };
            return CommonService.makeRequest(req);
        };
        /**
         *
         * Authenticate the user based on the given social network and accessToken for that socialNetwork
         * @param socialNetwork the type of social network
         * @param accessToken the access token from that social network
         */
        service.authenticateWithSocialNetwork = function (socialNetwork, accessToken) {
            var req = {
                method: 'POST',
                url: '/login?type=' + socialNetwork.toUpperCase(),
                data: {
                    accessToken: accessToken
                }
            };
            return CommonService.makeRequest(req);
        };

        /**
         * Refresh the current sessionToken.
         * This service method internally sets the localStorage and session storage to new sessionToken
         * @param sessionToken the session token
         */
        service.refreshToken = function (sessionToken) {
            var req = {
                method: 'POST',
                url: '/refreshToken',
                headers: {
                    'Authorization': 'Bearer ' + sessionToken
                }
            };
            return CommonService.makeRequest(req);
        };

        /**
         * Recover the forgotten password
         * @param email the user email
         */
        service.recoverPassword = function (email) {
            var req = {
                method: 'POST',
                url: '/forgotPassword?version=mobile&email=' + email
            };
            return CommonService.makeRequest(req);
        };

        /**
         * Reset forgotten password. Reset password token is mandatory
         * @param token the forgotten password token
         * @param password the new password to set
         */
        service.resetForgottenPassword = function (token, password) {
            var req = {
                method: 'POST',
                url: '/resetForgottenPassword',
                data: {
                    token: token,
                    newPassword: password
                }
            };
            return CommonService.makeRequest(req);
        };

        /**
         * Revoke the current session token
         */
        service.revokeSessionToken = function () {
            var req = {
                method: 'POST',
                url: '/revokeToken'
            };
            return CommonService.makeRequest(req);
        };

        /**
         * Reset the current user password.
         * It is simply updating the current user password
         *
         * @param password the password text
         */
        service.resetPassword = function (password) {
            var req = {
                method: 'POST',
                url: '/resetPassword',
                data: {
                    newPassword: password
                }
            };
            return CommonService.makeRequest(req);
        };

        service.checkPasswordLength = function (password) {
            return (password.length <= appConfig.PASSWORD_LENGTH);
        };

        service.checkPasswordContent = function (password) {
            return (/\d/.test(password) && /[A-Za-z]/.test(password));
        };
        return service;
    }

})();



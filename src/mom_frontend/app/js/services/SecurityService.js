/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Security Service.
 *
 * Changes in version 1.1:
 *  - Updated the resetPassword() method.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('SecurityService', ['storage', 'common', 'config', function (storage, common, config) {
        var service = {};
        /**
         * Authenticate the user using password type.
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
            return common.makeRequest(req);
        };
        /**
         * Authenticate the user based on the given social network and accessToken for that socialNetwork
         */
        service.authenticateWithSocialNetwork = function (socialNetwork, accessToken) {
            var req = {
                method: 'POST',
                url: '/login?type=' + socialNetwork.toUpperCase(),
                data: {
                    accessToken: accessToken
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Refresh the current sessionToken.
         * This service method internally sets the localStorage and session storage to new sessionToken
         */
        service.refreshToken = function (sessionToken) {
            var req = {
                method: 'POST',
                url: '/refreshToken',
                headers: {
                    'Authorization': 'Bearer ' + sessionToken
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Recover the forgotten password
         */
        service.recoverPassword = function (email) {
            var req = {
                method: 'POST',
                url: '/forgotPassword?email=' + email
            };
            return common.makeRequest(req);
        };

        /**
         * Reset forgotten password. Reset password token is mandatory
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
            return common.makeRequest(req);
        };

        /**
         * Revoke the current session token
         */
        service.revokeSessionToken = function () {
            var req = {
                method: 'POST',
                url: '/revokeToken'
            };
            return common.makeRequest(req);
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
            return common.makeRequest(req);
        };
        service.checkPasswordLength = function (password) {
            return (password.length <= config.PASSWORD_LENGTH);
        };

        service.checkPasswordContent = function (password) {
            return (/\d/.test(password) && /[A-Za-z]/.test(password));
        };
        return service;
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents storage service.
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-195] Add functions to store the user's email address
 *
 * Changes in version 1.2:
 * - [PMP-251] Add gift token storage functions
 *
 * Changes in version 1.3:
 * - [PMPISSUES-21] Don't clear gift token when logout
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('StorageService', StorageService);

    /**
     * Angular service that abstracts the sessionToken storage and retrieval
     */
    function StorageService() {
        var service = {};
        /**
         * Returns the stored sessionToken
         * This method first checks in sessionStorage if sessionToken is not found in sessionStorage
         * this method checks in localStorage, if sessionToken still not found in localStorage, then it will return null or undefined
         * The controllers has to implement the logic that if sessionToken is null/undefined then user is not authorized
         */
        service.getSessionToken = function () {
            var token = sessionStorage.getItem('momandpop.auth.token');
            if (!token) {
                token = localStorage.getItem('momandpop.auth.token');
            }
            return token;
        };
        /**
         * Store the session token in sessionStorage
         * A boolean flag is passed which when true indicate that user chose remember me option and data should also be stored in localStorage
         */
        service.storeSessionToken = function (sessionToken, flag) {
            sessionStorage.setItem('momandpop.auth.token', sessionToken);
            if (flag) {
                localStorage.setItem('momandpop.auth.token', sessionToken);
            }
        };

        /**
         * Get current user profile stored in sessionStorage or localStorage
         */
        service.getCurrentUserProfile = function () {
            var profile = sessionStorage.getItem('momandpop.auth.profile');
            if (!profile) {
                profile = localStorage.getItem('momandpop.auth.profile');
            }
            return angular.fromJson(profile);
        };

        /**
         * Store the current user profile in sessionStorage
         * A boolean flag is passed which when true indicate that user chose remember me option and data should also be stored in localStorage
         */
        service.storeCurrentUserProfile = function (profile, flag) {
	    var email = profile.email;
            profile = angular.toJson(profile);
            sessionStorage.setItem('momandpop.auth.profile', profile);
            if (flag) {
		service.storeUserEmail(email);
                localStorage.setItem('momandpop.auth.profile', profile);
            }
        };

        /**
         * Utility method to clear the sessionStorage
         */
        service.clear = function () {
            sessionStorage.removeItem('momandpop.auth.token');
            sessionStorage.removeItem('momandpop.auth.actions');
            sessionStorage.removeItem('momandpop.auth.profile');

            localStorage.removeItem('momandpop.auth.token');
            localStorage.removeItem('momandpop.auth.actions');
            localStorage.removeItem('momandpop.auth.profile');
        };

	/**
	 * Store the users email address into local storage. This is
	 * used to prepopulate the login form. PMP-195
	 * @param {String} [email] The email address
	 */
	service.storeUserEmail = function(email) {
	    localStorage.setItem('momandpop.auth.email', email);
	};

	/**
	 * Return the stored email address last used to login. PMP-195
	 */
	service.getUserEmail = function() {
	    return localStorage.getItem('momandpop.auth.email');
	};

	/**
         * store the pending gift card accept token
         * @param {String}  token       token to store
         */
        service.storeGiftToken = function(token) {
            localStorage.setItem('momandpop.gift.token', token);
        };

        /**
         * Return the pending gift card accept token
         */
        service.getGiftToken = function(token) {
            return localStorage.getItem('momandpop.gift.token');
        };

        /**
         * Clear the stored gift token
         */
        service.clearGiftToken = function() {
            localStorage.removeItem('momandpop.gift.token');
        };

        return service;
    }

})();



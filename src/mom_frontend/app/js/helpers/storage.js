/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular service that abstracts the sessionToken storage and retrieval
 *
 * Changes in version 1.1:
 *  - Added shopping cart related functions.
 *
 * Changes in version 1.2
 * - Add session storage for pending gift card accept task
 *
 * Changes in version 1.3 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-195] Add functions to store the user's email address
 *
 * @version 1.3
 * @author TCSASSEMBLER
 */
'use strict';

angular.module("app")
    .factory('storage', [function () {
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
            profile = angular.toJson(profile);
            sessionStorage.setItem('momandpop.auth.profile', profile);
	    if (flag) {
		// Store the email separately to be able to populate the
		// login form. PMP-195
		service.storeUserEmail(JSON.parse(profile).email);
	        localStorage.setItem('momandpop.auth.profile', profile);
            }
        };

        /**
         * Added shopping item to cart.
         * @param offerId the gift card offer Id.
         */
        service.addItemToCart = function (offerId) {
            var storedItem = sessionStorage.getItem('momandpop.cart.item');
            if (!storedItem) {
                storedItem = [];
            } else {
                storedItem = angular.fromJson(storedItem);
            }

            if (!_.contains(storedItem, offerId)) {
                storedItem.push(offerId);
            }

            sessionStorage.setItem('momandpop.cart.item', angular.toJson(storedItem));
        };

        /**
         * Clear all items from cart
         */
        service.clearCart = function () {
            sessionStorage.removeItem('momandpop.cart.item');
        };

        /**
         * Get shopping items from cart
         * @returns {*} the shopping item
         */
        service.getItemFromCart = function () {
            var storedItem = sessionStorage.getItem('momandpop.cart.item');
            if (!storedItem) {
                storedItem = [];
            } else {
                storedItem = angular.fromJson(storedItem);
            }

            return storedItem;
        };

        /**
         * Removed shopping item from cart.
         * @param id the item id.
         */
        service.removeItemFromCart = function (id) {
            var storedItem = sessionStorage.getItem('momandpop.cart.item');
            if (!storedItem) {
                storedItem = [];
            } else {
                storedItem = angular.fromJson(storedItem);
            }
            storedItem = _.without(storedItem, id);

            sessionStorage.setItem('momandpop.cart.item', angular.toJson(storedItem));
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

        /**
         * Utility method to clear the sessionStorage
         */
        service.clear = function () {
            sessionStorage.removeItem('momandpop.auth.token');
            sessionStorage.removeItem('momandpop.auth.actions');
            sessionStorage.removeItem('momandpop.auth.profile');
            sessionStorage.removeItem('momandpop.cart.item');

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

        return service;
    }]);

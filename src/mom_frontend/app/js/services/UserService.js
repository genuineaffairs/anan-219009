/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * User Service.
 *
 * Changes in version 1.1:
 *  - Added getActionRecords() method and fixed some other issues.
 *
 * Changes in version 1.2:
 *  - Added verifyEmail method.
 *
 * Changes in version 1.3
 * - Add deletPlatformAdmin
 * - Add addPlatformAdmin
 * - Add getAllPlatformAdmins
 * - Add verifyPlatformAdmin
 *
 * Changes in version 1.4
 * - Add updatePlatformAdmin
 *
 * Changes in version 1.5 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-220] Add subscribedToNews field
 *
 * Changes in 1.6 (Authentication and Social Media Integration enhancement):
 * - [PMP-246] Add addSocialConnection and removeSocialConnection
 *
 * Changes in 1.7 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Added switchRole and addBusiness
 * = [PMP-202] Added verifyEmailStop
 * 
 * @version 1.7
 * @author TCSASSEMBLER
 */


angular.module("app")
    .factory('UserService', ['common', function (common) {
        var service = {};

        /**
         * Register the user on mom and pop platform
         * registration is registration entity object which would be converted to json string
         * userProfile and businessProfile are optional
         */
        service.register = function (registration, userImage, businessImage) {
            var data = new FormData();
            data.append('registration', angular.toJson(registration));
            if (userImage) {
                data.append('profileImage', userImage);
            }
            if (businessImage) {
                data.append('businessImage', businessImage);
            }
            // prepare request object
            var req = {
                method: 'POST',
                url: '/register',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            return common.makeRequest(req);
        };

        /**
         * Verify email.
         * @param userId the user id
         * @param token the token
         * @returns {Promise} the promise result
         */
        service.verifyEmail = function (userId, token) {
            var data = new FormData();
            var requestData = {userId: userId, token: token};
            data.append('requestData', angular.toJson(requestData));

            // prepare request object
            var req = {
                method: 'POST',
                url: '/verifyEmail',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            return common.makeRequest(req);
        };
        /**
         * Stop Verify email.
         * @param userId the user id
         * @param token the token
         * @returns {Promise} the promise result
         */
        service.verifyEmailStop = function (userId, token) {
            var data = new FormData();
            var requestData = {userId: userId, token: token};
            data.append('requestData', angular.toJson(requestData));

            // prepare request object
            var req = {
                method: 'POST',
                url: '/verifyEmailStop',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            return common.makeRequest(req);
        };

        /**
         * Get my user profile
         */
        service.getMyUserProfile = function () {
            var req = {
                method: 'GET',
                url: '/users/me'
            };
            return common.makeRequest(req);
        };

        /**
         * Get my action records
         */
        service.getMyActions = function (criteria) {
            var req = {
                method: 'GET',
                url: '/users/me/actions',
                params: criteria
            };
            return common.makeRequest(req);
        };

        /**
         * Get action records entity.
         * @param criteria the search condition
         */
        service.getActionRecords = function (criteria) {
            var req = {
                method: 'GET',
                url: '/users/me/actionRecords',
                params: criteria
            };
            return common.makeRequest(req);
        };

        /**
         * Update current user profile
         * @param user the user to update
         */
        service.updateMyUserProfile = function (user) {
            var data = _.pick(user, 'firstName', 'lastName', 'email', 'location',
				'isLastNamePublic', 'isEmailPublic', 'isLocationPublic', 'isPicturePublic', 'subscribedToNews', 'autoShare');

            var req = {
                method: 'PUT',
                url: '/users/me',
                data: data
            };
            return common.makeRequest(req);
        };

        /**
         * Add a platform employee
         * Only users who have a PLATFORM_EMPLOYEE role is able to perform this operation
         */
        service.addPlatformAdmin = function(user, password) {
            var req = {
                method: 'POST',
                url: '/users/platformAdmins',
                data: {
                    user: user,
                    password: password
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Delete a platform employee
         * Only users who have a PLATFORM_EMPLOYEE role is able to perform this operation
         */
        service.deletePlatformAdmin = function(id, entity) {
            var req = {
                method: 'DELETE',
                data: entity,
                url: '/users/platformAdmins/' + id,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Fetch all platform employees
         * Only users who have a PLATFORM_EMPLOYEE role is able to perform this operation
         */
        service.getAllPlatformAdmins = function() {
            var req = {
                method: 'GET',
                url: '/users/platformAdmins'
            };
            return common.makeRequest(req);
        };

        /**
         * Verify a platform admin account
         */
        service.verifyPlatformAdmin = function(token) {
            var req = {
                method: 'POST',
                url: '/users/platformAdmins/verify',
                data: {
                    token: token
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Update a platform admin account
         */
        service.updatePlatformAdmin = function(user) {
            var req = {
                method: 'POST',
                url: '/users/me/platformAdmins',
                data: user
            };
            return common.makeRequest(req);
        };

        /**
         * Add social network connection to current user
         * @param type the social network type
         * @param accessToken the access token
         */
        service.addSocialConnection = function(type, accessToken) {
            var req = {
                method: 'POST',
                url: '/users/me/connections/' + type,
                data: {
                    accessToken: accessToken
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Remove social network connection to current user
         * @param type the social network type
         */
        service.removeSocialConnection = function(type) {
            var req = {
                method: 'DELETE',
                url: '/users/me/connections/' + type
            };
            return common.makeRequest(req);
        };


        /**
         * Switch user role.
         *
         * @param role the role to switch to
         */
        service.switchRole = function(role) {
            var req = {
                method: 'POST',
                url: '/switchRole',
                data: {
                    role: role
                }
            };
            return common.makeRequest(req);
        };
        /**
         * Adds business to existing user.
         *
         * @param business the business to add
         * @param image the business image to add
         */
        service.addBusiness = function(business, image) {
            var data = new FormData();
            data.append('business', angular.toJson(business));
            data.append('businessImage', image);
            var req = {
                method: 'POST',
                url: '/addBusiness',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            return common.makeRequest(req);
        };

        return service;
    }]);

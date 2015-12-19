/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents utility service.
 *
 * @version 1.5
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included function to get public menu
 *  - Included functions to get how it works and faq page data
 *  - Included function to get the messages for application modals
 *
 * Changes in 1.2
 *  - Included function to get users current location from browser
 *
 * Changes in 1.3 (Project Mom and Pop - Gift Card Offers Search and View)
 *  - If location is not allowed in browser, return location computed from IP address (getLocation method)
 *
 * Changes in 1.4 (Authentication and Social Media Integration enhancement):
 * - [PMP-246] add connectToSocialNetwork method
 *
 * Changes in 1.5 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Add setRolesToRootScope
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('UtilService', UtilService);

    UtilService.$inject = ['$http', '$log', '$q', '$rootScope', '$location', 'SecurityService', 'StorageService', 'UserService', 'Base64Service'];

    /**
     * Application utility service
     */
    function UtilService($http, $log, $q, $rootScope, $location, SecurityService, StorageService, UserService, Base64Service) {
        var service = {};

        service.getPublicMenu = function () {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'GET',
                url: 'assets/data/menuPublic.json'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.getChampionMenu = function () {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'GET',
                url: 'assets/data/menuChampion.json'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.getBusinessMenu = function () {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'GET',
                url: 'assets/data/menuEmployee.json'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.getHowItWorks = function () {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'GET',
                url: 'assets/data/howItWorks.json'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.getFAQ = function () {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'GET',
                url: 'assets/data/faq.json'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.getMessages = function () {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'GET',
                url: 'assets/data/messages.json'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * This function is called in interval to refresh the session token
         */
        service.refreshToken = function () {
            $log.info('Refreshing sessionToken');
            var token = localStorage.getItem('momandpop.auth.token');
            if (token) {
                SecurityService.refreshToken(token).then(function (loginResult) {
                    StorageService.storeSessionToken(loginResult.sessionToken, true);
                    // get user profile
                    SecurityService.getMyUserProfile().then(function (user) {
                        StorageService.storeCurrentUserProfile(user, true);
                    }, function (userReason) {
                        $log.error('Error fetching current user profile ' + userReason);
                    });
                }, function (reason) {
                    // some error occurred
                    $log.error('Session Token Refresh Error ' + reason);
                });
            }
        };

        /**
         * Function to check if any user is currently logged in
         */
        service.isLoggedIn = function () {
            var profile = StorageService.getCurrentUserProfile();
            var sessionToken = StorageService.getSessionToken();
            return !!(profile && sessionToken);
        };

        service.BUSINESS_ADMIN = 'BUSINESS_ADMIN';
        service.BUSINESS_EMPLOYEE = 'BUSINESS_EMPLOYEE';
        service.PLATFORM_EMPLOYEE = 'PLATFORM_EMPLOYEE';
        service.INDIVIDUAL_USER = 'INDIVIDUAL_USER';
        /**
         * Get user role by key.
         * @param key the role key
         * @returns {boolean} the check result.
         */
        service.getUserRoles = function (key) {
            var user = StorageService.getCurrentUserProfile();
            if (!user) {
                return false;
            }
            for (var i = 0; i < user.userRoles.length; i++) {
                if (user.userRoles[i].role === key) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Logout user and clear the data
         */
        service.logout = function () {
            $rootScope.loggedIn = false;
            $rootScope.loggedUser = undefined;
            StorageService.clear();
            $location.path('/');
        };

        /**
         * Returns the current geo location
         * @returns {boolean} the check result.
         */
        service.getLocation = function () {
            var deferred = $q.defer();

            getLocation();
            return deferred.promise;

            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        deferred.resolve(pos.coords);
                    }, function () {
                        deferred.resolve(window.USER_LOCATION);
                    });

                } else {
                    deferred.resolve(window.USER_LOCATION);
                }
            }
        };


        /**
         * Show OAuth popup and add social connection to current user
         * @param type the social network type
         */
        service.connectToSocialNetwork = function (type) {
            return $q(function (resolve) {
                var api2authType = {
                    FACEBOOK: "facebook",
                    TWITTER: "twitter",
                    LINKEDIN: "linkedin2"
                };
                OAuth.popup(api2authType[type]).done(function (result) {
                    var accessToken = result.access_token;
                    if (type === "TWITTER") {
                        accessToken = Base64Service.encode(result.oauth_token + ':' + result.oauth_token_secret);
                    }
                    UserService.addSocialConnection(type, accessToken).then(function () {
                        resolve();
                    });
                }).fail(function (err) {
                    $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                });
            });
        };

        /**
         * Set roles to root scope
         */
        service.setRolesToRootScope = function () {
            $rootScope.isFounder = false;
            $rootScope.isUser = false;
            $rootScope.isPlatformAdmin = false;
            if (service.getUserRoles(service.BUSINESS_ADMIN) || service.getUserRoles(UtilService.BUSINESS_EMPLOYEE)) $rootScope.isFounder = true;
            else if (service.getUserRoles(service.INDIVIDUAL_USER)) $rootScope.isUser = true;
            else if (service.getUserRoles(service.PLATFORM_EMPLOYEE)) $rootScope.isPlatformAdmin = true;

            if($rootScope.loggedUser && $rootScope.loggedUser.loggedInAs) {
                if ($rootScope.loggedUser.loggedInAs === service.INDIVIDUAL_USER) {
                    $rootScope.isFounder = false;
                    $rootScope.isUser = true;
                } else {
                    $rootScope.isFounder = true;
                    $rootScope.isUser = false;
                }
            }
        };
        return service;
    }

})();



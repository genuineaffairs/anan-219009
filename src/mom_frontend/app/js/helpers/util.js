/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application utility service
 *
 * Changes in version 1.1:
 *  - Added getUserRoles() method.
 *
 * Changes in version 1.2:
 *  - Add support for redirect after login
 *
 * Changes in version 1.3:
 *  - Updated loginHandler and logout method to handle login page redirect.
 *
 * Changes in version 1.4:
 *  - Add pendingComment login to loginHandler
 *
 * Changes in version 1.5
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.6:
 * - [PMP-251] Add callback parameter to loginHandler
 * - [PMP-252] Check if business payment method is verified
 *
 * Changes in 1.7 (Authentication and Social Media Integration enhancement):
 * - [PMP-246] Add connectToSocialNetwork
 *
 * Changes in 1.8 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - Refactored code to improve readability
 * - [PMP-237] - Added refreshUser. This method will be called whenever user is updated.
 * - [PMP-237] - Added setRolesToRootScope. Called whenever needed to update logged in user's role status.
 *
 * @version 1.8
 * @author TCSASSEMBLER
 */
'use strict';

angular.module("app")
    .factory('util', ['$log', '$rootScope', 'SecurityService', 'UserService', 'GiftCardOfferService', 'BusinessService',
        'storage', '$location', 'notify', 'base64', '$q', 'SharingService',
        function ($log, $rootScope, SecurityService, UserService, GiftCardOfferService, BusinessService, storage,
                  $location, notify, base64, $q, SharingService) {
            var service = {
                BUSINESS_ADMIN: 'BUSINESS_ADMIN',
                BUSINESS_EMPLOYEE: 'BUSINESS_EMPLOYEE',
                PLATFORM_EMPLOYEE: 'PLATFORM_EMPLOYEE',
                INDIVIDUAL_USER:  'INDIVIDUAL_USER'
            };
            service.refreshToken = refreshToken;
            service.isLoggedIn = isLoggedIn;
            service.getCartItemNumber = getCartItemNumber;
            service.getUserRoles = getUserRoles;
            service.setRolesToRootScope = setRolesToRootScope;
            service.loginHandler = loginHandler;
            service.logout = logout;
            service.connectToSocialNetwork = connectToSocialNetwork;
            service.refreshUser = refreshUser;

            /**
             * This function is called in interval to refresh the session token
             */
            function refreshToken () {
                $log.info('Refreshing sessionToken');
                var token = storage.getSessionToken(true);
                if (token) {
                    SecurityService.refreshToken(token).then(function (loginResult) {
                        storage.storeSessionToken(loginResult.sessionToken, true);
                        // get user profile
                        UserService.getMyUserProfile().then(function (user) {
                            storage.storeCurrentUserProfile(user, true);
                        }, function (userReason) {
                            $log.error('Error fetching current user profile ' + userReason);
                        });
                    }, function (reason) {
                        // some error occurred
                        $log.error('Session Token Refresh Error ' + reason);
                    });
                }
            }

            /**
             * Function to check if any user is currently logged in
             */
            function isLoggedIn () {
                var profile = storage.getCurrentUserProfile();
                var sessionToken = storage.getSessionToken();
                return !!(profile && sessionToken);

            }

            function getCartItemNumber () {
                var items = storage.getItemFromCart();
                if (items) {
                    return items.length;
                }
                return 0;
            }

            /**
             * Get user role by key.
             * @param key the role key
             * @returns {boolean} the check result.
             */
            function getUserRoles (key) {
                var user = storage.getCurrentUserProfile();
                if (!user) {
                    return false;
                }
                for (var i = 0; i < user.userRoles.length; i++) {
                    if (user.userRoles[i].role === key) {
                        return user.userRoles[i];
                    }
                }
                return false;
            }
            /**
             * Set roles to root scope
             */
            function setRolesToRootScope () {
                $rootScope.isFounder = false;
                $rootScope.isUser = false;
                $rootScope.isPlatformAdmin = false;
                if (service.getUserRoles(service.BUSINESS_ADMIN)
                    || service.getUserRoles(service.BUSINESS_EMPLOYEE)) $rootScope.isFounder = true;
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
            }

            /**
             * Login user by token
             * @param token the access token
             * @param rememberMe the flag if remember login
             * @param Function() callback If set, the callback is called
             *   instead of redirecting the user after handling login
             */
            function loginHandler (token, rememberMe, callback) {
                storage.storeSessionToken(token, rememberMe);
                UserService.getMyUserProfile().then(function (data) {
                    $rootScope.loggedUser = data;
                    storage.storeCurrentUserProfile(data, rememberMe);
                    service.setRolesToRootScope();
                    //if user is a founder, check if the business is setup
                    if ($rootScope.isFounder) {
                        BusinessService.getMyBusiness().then(function (business) {
                            $rootScope.isVerificationFeePaid = business.isVerificationFeePaid;
                        });
                    }
                    if ($rootScope.tmp && $rootScope.tmp.pendingComment) {
                        var offerId = $rootScope.tmp.pendingComment.giftCardOfferId;
                        var comment = $rootScope.tmp.pendingComment.comment;
                        delete $rootScope.tmp.pendingComment;
                        GiftCardOfferService.createGiftCardOfferComment(offerId, comment).then(function () {
                            $location.url('/?offerId=' + offerId);
                        }, function () {
                            $location.url('/?offerId=' + offerId);
                            notify({message: 'Cannot create comment', templateUrl: 'partials/module/notify-popup.html'});
                        });
                        return;
                    }
                    if (service.getUserRoles(service.BUSINESS_EMPLOYEE)) {
                        notify({message: 'Business employee are not allowed to log in.', templateUrl: 'partials/module/notify-popup.html'});
                        storage.clear();
                        return;
                    }
                    if ($rootScope.tmp && $rootScope.tmp.redirectUrl) {
                        $location.url($rootScope.tmp.redirectUrl);
                        $rootScope.tmp.redirectUrl = null;
                        return;
                    }
                    if (callback) {
                        return callback();
                    }
                    if ($rootScope.isFounder) {
                        $location.path('/FounderStatus');
                    } else {
                        $location.path('/Founder$hares');
                    }
                }, function (profileReason) {
                    $log.error('Error fetching user profile HTTP STATUS CODE [ ' + profileReason.status + ' ] Error [ ' + angular.toJson(profileReason.data) + ' ]');
                });
            }

            /**
             * Logout user and clear the data
             */
            function logout () {
                if ($rootScope.tmp) {
                    delete $rootScope.tmp;
                }
                storage.clear();
                $rootScope.loggedUser = null;
                $rootScope.isFounder = false;
                $rootScope.isUser = false;
                $rootScope.isPlatformAdmin = false;
                $rootScope.isVerificationFeePaid = false;
                $location.path('/Login');
            }

            /**
             * Show OAuth popup and add social connection to current user
             * @param type the social network type
             */
            function connectToSocialNetwork (type) {
                return $q(function (resolve) {
                    OAuth.popup(SharingService.api2authType[type]).done(function (result) {
                        var accessToken = result.access_token;
                        if (type === "TWITTER") {
                            accessToken = base64.encode(result.oauth_token + ':' + result.oauth_token_secret);
                        }
                        UserService.addSocialConnection(type, accessToken).then(function () {
                            resolve();
                        }, function (reason) {
                            notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        });
                    }).fail(function (err) {
                        $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                    });
                });
            }

            function refreshUser (cb) {
                UserService.getMyUserProfile().then(function (data) {
                    $rootScope.loggedUser = data;
                    storage.storeCurrentUserProfile(data, true);
                    service.setRolesToRootScope();
                    if ($rootScope.isFounder) {
                        BusinessService.getMyBusiness().then(function (business) {
                            $rootScope.isVerificationFeePaid = business.isVerificationFeePaid;
                        });
                    }
                    if(cb && cb instanceof Function) {
                        cb(null, data);
                    }
                }).catch(function (err) {
                    if(cb && cb instanceof Function)
                        cb(err);
                });
            }
            return service;
        }]);

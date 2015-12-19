/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents app file
 *
 * @version 1.10
 * @author TCSASSEMBLER
 *
 * Changes in 1.1:
 * 1. Implement Founder Home and change routes.
 * 2. Add directives and filters modules.
 *
 * Changes in 1.2:
 * 1. Add open gift route
 * 2. Add support for redirection after log in
 *
 * Changes in 1.3:
 *  - Added previousTransactions route.
 *
 * Changes in 1.4:
 *  - Don't redirect to home on initial page load (allow to open requested page directly)
 *  - Add my history for founder
 *
 * Changes in 1.5:
 *  - Refactor the entire mobile application
 *
 * Changes in 1.6:
 *  - Changed home page from champion-home to offers page
 *  - Change the modal displayed if $routeChangeError
 *
 * Changes in 1.7:
 *  - Included new hrefs like tel, maps in $compileProvider
 *
 * Changes in version 1.8 (Project Mom and Pop - MiscUpdate5):
 *  - When accessing /contact-support, save the source path to rootScope.redirectUrl
 *
 * Changes in version 1.9:
 * - [PMP-251] Add callback parameter to loginHandler
 *
 * Changes in version 1.10 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2):
 * - [PMP-237] Refactored the code to use same variable for check user role.
 *
 */
(function () {
    'use strict';

    angular
        .module('app', [
            'ngRoute',
            'ngTouch',
            'ui.bootstrap',
            'angular-loading-bar',
            'infinite-scroll',
            'slick',
            'templates.app',
            'app.components',
            'app.common',
            'app.champion',
            'app.founder',
            'angulartics',
            'angulartics.google.analytics'
        ])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/home', {
                    redirectTo: '/',
                    isPublic: true
                })
                .otherwise({
                    redirectTo: '/',
                    isPublic: true
                });

        }])
        .config(['$compileProvider', function ($compileProvider) {
            $compileProvider
                .aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript|tel|google.navigation|maps|bingmaps):/);

        }])
        .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        }])
        .run(['$rootScope', function ($rootScope) {
            $rootScope.$watch("loggedUser", function (value) {
                if (value) {
                    ga("set", "&uid", value.id);
                } else {
                    ga("set", "&uid", null);
                }
            });
        }])
        .run(['$rootScope', '$location', '$modal', '$window', '$log', '$interval', 'SecurityService',
            'UserService', 'ModalService','StorageService', 'UtilService', 'appConfig',
            function ($rootScope, $location, $modal, $window, $log, $interval, SecurityService, UserService,
                      ModalService, StorageService, UtilService, appConfig) {

                $(document).ready(function () {
                    OAuth.initialize(appConfig.OAUTH_PUBLIC_KEY);
                });

                $rootScope.tmp = {};
                $rootScope.location = $location;
                $rootScope.login = false;
                $rootScope.user = {};
                $rootScope.menu = {};
                $rootScope.getHome = function () {
                    if ($rootScope.isUser) {
                        return '/'
                    } else {
                        return '/founder-home';
                    }
                };

                $rootScope.goto = function (path) {
                    $rootScope.isExpand = false;
                    if (path === 'back') { // Allow a 'back' keyword to go to previous page
                        $window.history.back();
                    } else { // Go to the specified path
                        $location.path(path);
                    }
                };

                $rootScope.$on('$routeChangeStart', function (e, target, current) {
                    $rootScope.modal = false;
                    var route = target.$$route;
                    if (!route) {
                        return;
                    }
                    // When target is 'contact-support', save the
                    // originating page, so we can redirect back to it
                    // after support form was successfully sent.
                    if (route.originalPath === '/contact-support') {
                        if (current) {
                            $rootScope.redirectUrl = current.$$route.originalPath;
                        } else {
                            $rootScope.redirectUrl = '/';
                        }
                    }
                    if (route.isPublic || route.originalPath == '') {
                        return;
                    }
                    if (!UtilService.isLoggedIn()) {
                        $location.path('/login');
                        return;
                    }
                    if (!route.roles) {
                        return;
                    }
                    var hasAccess = _.any(route.roles, UtilService.getUserRoles);
                    if (!hasAccess) {
                        $location.path('/');
                    }
                });

                if (!UtilService.isLoggedIn()) {
                    StorageService.clear();
                } else {
                    UtilService.setRolesToRootScope();
                    $rootScope.loggedUser = StorageService.getCurrentUserProfile();
                }
                $rootScope.shortDateFormat = 'MM/dd/yyyy';
                $rootScope.longDateFormat = 'MM/dd/yyyy hh:mm a';

                /**
                 * Show modal dialog with success message
                 * @param {String} text the text to display
                 * @returns {Object} the modal instance
                 */
                $rootScope.showSuccessAlert = function (text) {
                    return $modal.open({
                        templateUrl: 'components/modals/modal.html',
                        controller: 'ModalCtrl',
                        resolve: {
                            text: function () {
                                return text;
                            }
                        }
                    });
                };

                /**
                 * Show modal dialog with error message
                 * @param {String} text the text to display
                 * @returns {Object} the modal instance
                 */
                $rootScope.showErrorAlert = function (text, windowClass) {
                    return $modal.open({
                        templateUrl: 'components/modals/error-modal.html',
                        controller: 'ModalCtrl',
                        resolve: {
                            text: function () {
                                return text;
                            }
                        },
                        windowClass: windowClass
                    });
                };

                $rootScope.$on('$routeChangeError', function() {
                    ModalService.showModal('id012','alert');
                });

                /**
                 * Login user to application and retrieve his profile
                 * @param token the session token
                 * @param rememberMe the flag if remember user
                 * @param Function() callback If set, the callback is called
                 *   instead of redirecting the user after handling login
                 */
                $rootScope.loginHandler = function (token, rememberMe, callback) {
                    StorageService.storeSessionToken(token, rememberMe);
                    UserService.getMyUserProfile().then(function (data) {
                        $rootScope.loggedUser = data;
                        StorageService.storeCurrentUserProfile(data, rememberMe);
                        UtilService.setRolesToRootScope();
                        $rootScope.$broadcast("authScopeChanged");
                        if ($rootScope.tmp && $rootScope.tmp.redirectUrl) {
                            $location.url($rootScope.tmp.redirectUrl);
                            $rootScope.tmp.redirectUrl = null;
                            return;
                        }
                        if (callback) {
                            return callback();
                        }
                        if ($rootScope.isUser) {
                            $location.path('/');
                        } else {
                            $location.path('/founder-home');
                        }
                    }, function (reason) {
                        alert(reason.error);
                    });
                };
            }]);
})();

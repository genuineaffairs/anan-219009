/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for login page
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-195] Prepopulate email field with saved value
 *
 * Changes in version 1.2 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Pre-Populate email when user redirected from register page
 * to sign up as business owner with his champion account
 */

(function () {
    'use strict';

    angular
        .module('app.common.login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$scope', '$rootScope', '$log', 'UserService', 'SecurityService', 'Base64Service', 'StorageService', '$modal', 'GLOBAL_OPTIONS'];

    //Login Controller
    function LoginCtrl($scope, $rootScope, $log, UserService, SecurityService, Base64Service, StorageService, $modal, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);
        // scope level variables
        $scope.email = '';
	$scope.username = StorageService.getUserEmail() || $rootScope.tmp.email || '';
        delete $rootScope.tmp.email;
        $scope.password = '';
        $scope.rememberMe = false;

        $scope.socialNetworks = {
            facebook: 'FACEBOOK',
            twitter: 'TWITTER',
            linkedin: 'LINKEDIN'
        };


        var completeRegistration = function (isModal) {
            UserService.register($scope.socialData).then(function (result) {
                $rootScope.loginHandler(result.sessionToken, true);
            }, function (reason) {
                if (isModal) {
                    alert(reason.error);
                    return;
                }
                $scope.showChooseAccountType = false;
                $scope.showError = true;
                $scope.errorMsg = reason.error;
            });
        };

        $scope.chooseAccountType = function (accountType) {
            $scope.socialData.accountType = accountType;
            if ($scope.socialData.linkedSocialNetwork === "TWITTER") {
                $modal.open({
                    templateUrl: 'components/modals/modal-complete-registration.html',
                    controller: 'ModalCompleteSignUpCtrl'
                }).result.then(function (email) {
                        $scope.socialData.email = email;
                        completeRegistration(true);
                    });
            } else {
                completeRegistration();
            }
        };

        var loginHandler = function (token) {
            $rootScope.loginHandler(token, $scope.rememberMe);
        };

        $scope.login = function () {
            if (!$scope.username || !$scope.password) {
                $scope.showError = true;
            } else {
                // login via password type
                SecurityService.authenticate($scope.username, $scope.password).then(function (data) {
                    loginHandler(data.sessionToken);
                }, function (reason) {
                    $log.error('Login Error HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
                    $scope.showError = true;
                    if (reason.status === 401 || reason.status === 403) {
                        $scope.errorMsg = 'Invalid email/password';
                    } else {
                        $scope.errorMsg = reason.error;
                    }
                });
            }
        };

        var socialNetworkLoginHandler = function (socialNetwork, token) {
            SecurityService.authenticateWithSocialNetwork(socialNetwork, token).then(function (data) {
                loginHandler(data.sessionToken);
            }, function (reason) {
                if (reason.error === "User is not registered") {
                    $scope.showChooseAccountType = true;
                    $scope.socialData = {
                        linkedSocialNetwork: socialNetwork,
                        linkedSocialNetworkAccessToken: token
                    }
                } else {
                    $scope.showError = true;
                    $scope.errorMsg = reason.error;
                }
            });
        };

        $scope.loginWithSocialNetwork = function (socialNetwork) {
            if (socialNetwork === $scope.socialNetworks.facebook) {
                OAuth.popup('facebook').done(function (result) {
                    socialNetworkLoginHandler(socialNetwork, result.access_token);
                }).fail(function (err) {
                    $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                });
            } else if (socialNetwork === $scope.socialNetworks.linkedin) {
                OAuth.popup('linkedin2').done(function (result) {
                    socialNetworkLoginHandler(socialNetwork, result.access_token);
                }).fail(function (err) {
                    $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                });
            } else if (socialNetwork === $scope.socialNetworks.twitter) {
                OAuth.popup('twitter').done(function (result) {
                    var token = Base64Service.encode(result.oauth_token + ':' + result.oauth_token_secret);
                    socialNetworkLoginHandler(socialNetwork, token);
                }).fail(function (err) {
                    $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                });
            }
        };

        // clear validation error, while focus  in input boxes;
        $scope.clearValidateError = function () {
            $scope.showError = false;
        };

        $scope.toggleRememberMe = function () {
            $scope.rememberMe = !$scope.rememberMe;
        };
    }
})();

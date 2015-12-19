/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Login Controller
 *
 * Changes in version 1.1
 * - Clear the gift token after login, it is handled during registration
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.2 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-195] Prepopulate email field with saved value
 * Changes in version 1.2 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Pre-Populate email when user redirected from register page
 * to sign up as business owner with his champion account
 *
 * @version 1.3
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('loginCtrl', ['$scope', '$location', '$rootScope', '$log', 'SecurityService', 'UserService', 'storage', 'base64', 'util', 'notify',
        function ($scope, $location, $rootScope, $log, SecurityService, UserService, storage, base64, util, notify) {
            $scope.rememberMe = false;
            $scope.username = storage.getUserEmail() || $rootScope.tmp.email || '';
            delete $rootScope.tmp.email;
            $scope.password = '';
            $scope.loginError = false;
            $scope.closeAccountModal = function () {
                $scope.accountTypeModal = false;
            };
            $scope.closeRegistrationModal = function () {
                $scope.completeRegistrationModal = false;
            };
            $scope.chooseAccountType = function (accountType) {
                $scope.socialData.accountType = accountType;
                if ($scope.socialData.linkedSocialNetwork === "TWITTER") {
                    $scope.completeRegistrationModal = true;
                    $scope.closeAccountModal();
                } else {
                    $scope.completeRegistration();
                }
            };
            $scope.completeRegistration = function (form, email) {
                if (form && form.$invalid) {
                    return;
                }
                if (email) {
                    $scope.socialData.email = email;
                }
                UserService.register($scope.socialData).then(function (result) {
                    util.loginHandler(result.sessionToken, true);
                    $scope.closeRegistrationModal();
                }, function (reason) {
                    if (form) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        return;
                    }
                    $scope.accountTypeModal = false;
                    $scope.loginError = true;
                    $scope.errorMsg = reason.error;
                });
            };
            var loginHandler = function (token) {
                // don't call the pending accept gift card action twice
                storage.clearGiftToken();
                util.loginHandler(token, $scope.rememberMe);
            };

            $scope.login = function () {
                if (!$scope.username || !$scope.password) {
                    $scope.loginError = true;
                } else {
                    // login via password type
                    SecurityService.authenticate($scope.username, $scope.password).then(function (data) {
                        loginHandler(data.sessionToken);
                    }, function (data) {
                        $scope.loginError = true;
                        if (data && data.error) {
                            $scope.errorMsg = data.error;
                        } else {
                            $scope.errorMsg = "Internet connection error.";
                        }
                    });
                }
            };

            var socialNetworkLoginHandler = function (socialNetwork, token) {
                SecurityService.authenticateWithSocialNetwork(socialNetwork, token).then(function (data) {
                    loginHandler(data.sessionToken);
                }, function (reason) {
                    if (reason.error === "User is not registered") {
                        $scope.accountTypeModal = true;
                        $scope.socialData = {
                            linkedSocialNetwork: socialNetwork,
                            linkedSocialNetworkAccessToken: token
                        }
                    } else {
                        $scope.loginError = true;
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
                        var token = base64.encode(result.oauth_token + ':' + result.oauth_token_secret);
                        socialNetworkLoginHandler(socialNetwork, token);
                    }).fail(function (err) {
                        $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                    });
                }
            };
        }
    ]);

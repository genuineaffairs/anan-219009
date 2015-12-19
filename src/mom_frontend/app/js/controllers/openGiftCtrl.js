/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Open gift Controller
 *
 * Changes in version 1.1
 * - Add local caching of gift card accept token
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.2:
 * - [PMP-251] Fix gift open process
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('openGiftCtrl', ['$scope', '$rootScope', 'GiftCardService', "$routeParams", "$location", "util", "$log", "storage", "notify",
	function ($scope, $rootScope, GiftCardService, $routeParams, $location, util, $log, storage, notify) {
            if (!util.isLoggedIn()) {
                $scope.modalLoginRequired = true;
                $scope.modal = true;
                $scope.tmp.redirectUrl = $location.url();
                storage.storeGiftToken($routeParams.code);
                return;
            }
            if (!$scope.isUser) {
                $scope.modalError = true;
                $scope.modal = true;
                $scope.errorText = "Only champions are allowed to accept the gifts";
            } else {

                var handleResult = function (promise) {
                    promise.then(function (gift) {
                        $rootScope.tmp.giftOpened = gift;
                        $location.path('/Founder$hares');
                    }, function (res) {
                        $scope.loginTwitter = false;
                        $scope.modalError = true;
                        $scope.modal = true;
                        $scope.errorText = res.error;
                    });
                }

                if ($routeParams.type === "twitter") {
                    $scope.loginTwitter = true;
                    $scope.modal = true;
                    $scope.loginWithTwitter = function () {
                        OAuth.popup('twitter').done(function (result) {
                            handleResult(GiftCardService.acceptGiftFromTwitter($routeParams.code, {
                                accessToken: result.oauth_token,
                                accessTokenSecret: result.oauth_token_secret
                            }))
                        }).fail(function (err) {
                            $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                            notify({message: "Cannot authenticate you", templateUrl: 'partials/module/notify-popup.html'});
                        });
                    };
                } else {
                    handleResult(GiftCardService.acceptGift($routeParams.code))
                }
            }
        }]);

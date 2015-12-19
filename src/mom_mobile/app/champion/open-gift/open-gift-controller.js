/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for gift
 *
 * @version 1.4
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *     - Change the route of My Foundershares page from 'champion-home' to 'founder-shares'
 *     - Change file name from gift to open-gift
 *
 * Changes in 1.2 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-224] Implement user feedback
 *
 * Changes in 1.3:
 * - [PMP-251] Save gift token if user is not logged in
 *
 * Changes in 1.4 (Authentication and Social Media Integration enhancement):
 * - [PMP-246] Update share text
 */

(function () {
    'use strict';

    angular
        .module('app.champion.openGift')
        .controller('OpenGiftCtrl', OpenGiftCtrl);

    OpenGiftCtrl.$inject = ['$scope', '$rootScope', 'GiftCardService', '$routeParams', '$location', 'UtilService', '$log', 'ModalService', '$modal', 'StorageService'];

    //Open gift controller
    function OpenGiftCtrl($scope, $rootScope, GiftCardService, $routeParams, $location, UtilService, $log, ModalService, $modal, StorageService) {
	$scope.ms = ModalService;
        if (!UtilService.isLoggedIn()) {
	    StorageService.storeGiftToken($routeParams.code);
            $modal.open({
                templateUrl: 'champion/open-gift/modal-done.html',
                controller: 'ModalCtrl',
                resolve: {
                    text: function () {
                        return "Please create an account or login to your account to receive your gift";
                    }
                }
            });
            $rootScope.tmp.redirectUrl = $location.url();
            $location.url("/login");
        } else if (!$scope.isUser) {
            $scope.showErrorAlert("Only champions are allowed to accept the gifts");
            $location.url("/");
        } else {
            var handleResult = function (promise) {
                return promise.then(function (giftCard) {
                    $scope.ms.redirectUrl = '/founder-shares';
                    $scope.ms.showModal('id028', 'rate');
                    $scope.ms.currentMessage.ratingId = {
                        type: 'GIFT_ACCEPTED',
                        userId: $rootScope.loggedUser.id
                    };
                    $scope.ms.currentMessage.shareText = $scope.ms.currentMessage.tmplShareText.replace('[business name]', giftCard.businessName);
                    $scope.ms.currentMessage.shareTextTw = $scope.ms.currentMessage.tmplShareTextTw.replace('[business name]', giftCard.businessName);
                }, function (res) {
                    $location.url('/founder-shares');
                    $scope.showErrorAlert(res.error);
                });
            };

            if ($routeParams.type === "twitter") {
                $modal.open({
                    templateUrl: 'champion/open-gift/modal-twitter.html',
                    controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {
                        $scope.loginWithTwitter = function () {
                            OAuth.popup('twitter').done(function (result) {
                                handleResult(GiftCardService.acceptGiftFromTwitter($routeParams.code, {
                                    accessToken: result.oauth_token,
                                    accessTokenSecret: result.oauth_token_secret
                                })).then(function () {
                                    $modalInstance.close();
                                });
                            }).fail(function (err) {
                                $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                                alert("Cannot authenticate you")
                            });
                        };
                        $scope.close = $modalInstance.dismiss();
                    }]
                }).result.then(_.noop, function () {
                        $location.url('/founder-shares');
                    });
            } else {
                handleResult(GiftCardService.acceptGift($routeParams.code))
            }
        }
    }
})();

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Verify email Controller
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.2:
 * - [PMP-251] Fix gift open process
 *
 * Changes in version 1.3:
 * - [PMPISSUES-21] Clear gift token in local storage after accepting gift
 *
 * @version 1.3
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("verifyEmailCtrl", ['$scope', '$routeParams', 'UserService', 'util', '$rootScope', 'notify', 'storage', '$log', 'GiftCardService', '$location', '$analytics', function ($scope, $routeParams, UserService, util, $rootScope, notify, storage, $log, GiftCardService, $location, $analytics) {

        UserService.verifyEmail($routeParams.userId, $routeParams.token).then(function (result) {
            $rootScope.tmp = undefined;
            util.loginHandler(result.sessionToken, true, function () {
                $analytics.eventTrack($rootScope.isFounder ? "Owner" : "Champion", {  category: 'Complete registration' });
                var code = storage.getGiftToken();
                if (code) {
                    $log.info('Accepting pending gift cards for newly registered user');
                    GiftCardService.acceptGift(code, result.sessionToken).then(function (gift) {
                        if (!$rootScope.tmp) {
                            $rootScope.tmp = {};
                        }
                        $rootScope.tmp.giftOpened = gift;
                        storage.clearGiftToken();
                        $location.path('/Founder$hares');
                    })
                } else {
                    $location.path('/Founder$hares');
                }
            });
        }, function (reason) {
            $rootScope.tmp = {
                redirectUrl: '/'
            };
            notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
            return;
        });

    }]);

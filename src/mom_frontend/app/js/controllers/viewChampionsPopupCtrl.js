/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for view champions popup.
 *
 * Changes in 1.1:
 *  - Display completely new table with champions
 *
 * Changes in version 1.2
 * - Replace native javascript alert with notify
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("viewChampionsPopupCtrl", ['$scope', '$rootScope', 'GiftCardService', 'notify',
        function ($scope, $rootScope, GiftCardService, notify) {
            // close view details
            $scope.closeInfo = function () {
                $scope.hidePopup();
            };

            /**
             * Show popup.
             */
            $scope.showPopup = function () {
                $scope.display = true;
                $rootScope.details = true;
            };

            /**
             * Hide popup.
             */
            $scope.hidePopup = function () {
                $scope.display = false;
                $rootScope.details = false;
            };

            // add comment
            $scope.checkComment = function () {
                $scope.check = true;
            };

            $scope.champions = [];

            /**
             * Get champions.
             * @param id the gift card id.
             */
            $scope.getChampions = function (id) {
                GiftCardService.searchChampions(id, {pageNumber: 0}).then(function (result) {

                    var champions = {};
                    var total = $scope.total = {
                        purchased: 0,
                        gifted: 0,
                        redeemed: 0,
                        remaining: 0,
                        received: 0
                    };
                    _.each(result, function (item) {
                        if (!champions[item.ownerId]) {
                            champions[item.ownerId] = {
                                name: item.firstName + " " + item.lastName,
                                purchased: 0,
                                gifted: 0,
                                redeemed: 0,
                                remaining: 0,
                                received: 0,
                                accountType: item.linkedSocialNetwork || "e-mail"
                            }
                        }
                        var stats = champions[item.ownerId];
                        var redeemed = _.reduce(item.giftCardRedeems, function (memo, redeem) {
                            return memo + redeem.amount;
                        }, 0);
                        if (!item.isGift) {
                            stats.purchased += item.originalQuantity;
                        } else {
                            stats.received += item.originalQuantity;
                        }
                        stats.redeemed += redeemed;
                        stats.gifted += item.originalQuantity - item.quantity - redeemed;
                        stats.remaining += item.quantity;

                        total.purchased += stats.purchased;
                        total.gifted += stats.gifted;
                        total.redeemed += stats.redeemed;
                        total.remaining += stats.remaining;
                        total.received += stats.received;
                    });
                    $scope.champions = _.values(champions);

                    $scope.showPopup();
                }, function () {
                    notify({message: 'Cannot get champions list', templateUrl: 'partials/module/notify-popup.html'});
                });

            };

            $scope.$on("showViewChampionsPopup", function (e, id) {
                $scope.getChampions(id);
            });
        }]);

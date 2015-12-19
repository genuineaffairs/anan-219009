/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Summary Controller
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.2
 * - record.metadata.giftCardId is now record.giftCardId
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('giftCardSummaryCtrl', ['$scope', "GiftCardService", "BusinessService", "$q", "notify",
        function ($scope, GiftCardService, BusinessService, $q, notify) {
            $q.all([
                GiftCardService.searchAll({pageNumber: 0}),
                BusinessService.getMyBusinessActions({pageNumber: 0})
            ]).then(function (result) {
                var giftCards = result[0].items;
                var records = result[1].items;
                $scope.giftCards = giftCards;
                _.each($scope.giftCards, function (card) {
                    card.totalRedeemed = _.reduce(card.giftCardRedeems, function (total, redeem) {
                        return total + redeem.amount;
                    }, 0);
                });
                var index = _.indexBy(giftCards, "id");
                _.each(records, function (record) {
                    var gift = index[record.giftCardId];
                    if (gift) {
                        if (!gift.history) {
                            gift.history = [];
                        }
                        gift.history.push(record);
                    }
                });
            }, function () {
                notify({message: "Cannot get data", templateUrl: 'partials/module/notify-popup.html'});
            });
            //show gift card history
            $scope.showHistory = function (giftCard) {
                $scope.isHistory = true;
                $scope.giftCard = giftCard;
            };
            //hide gift card history
            $scope.hideHistory = function () {
                $scope.isHistory = false;
                $scope.giftCard = null;
            };
        }]);

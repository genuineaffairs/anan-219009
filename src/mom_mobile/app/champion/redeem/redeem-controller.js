/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for champion redeem page
 *
 * @version 1.4
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included check for latest transaction and show share modals
 *  - Modify the format of the qr code and page
 *
 * Changes in 1.2
 *  - giftCard.qrCode is now called giftCard.currentQRCode
 *  - use _.last makes code more readable
 *
 * Changes in version 1.3 (Project Mom and Pop - Release Fall 2015):
 *  - [PMP-219] Fix Success message
 *  - [PMP-224] Implement user feedback
 * 
 * Changes in 1.4 (Authentication and Social Media Integration enhancement):
 * - [PMP-246] Update share text
 */

(function () {
    'use strict';

    angular
        .module('app.champion.redeem')
        .controller('ChampionRedeemCtrl', ChampionRedeemCtrl);


    ChampionRedeemCtrl.$inject = ['$scope', '$rootScope', '$location', 'GiftCardService', 'ModalService', 'DATA', 'GLOBAL_OPTIONS'];

    // redeem page controller
    function ChampionRedeemCtrl($scope, $rootScope, $location, GiftCardService, ModalService, DATA, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);

        $scope.giftCard = DATA;
        $scope.vm = {};
        $scope.ms = ModalService;
        $scope.vm.done = done;

        var qrcode = new QRCode("qrimage", {
            text: $scope.giftCard.currentQRCode,
            width: 250,
            height: 250,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        //Once user clicks done, verify for latest transaction and show share modal
        function done() {
            $scope.ms.giftCard = $scope.giftCard;
            $scope.ms.redirectUrl = 'home';
            GiftCardService
                .getMyGiftCard($scope.giftCard.id)
                .then(function (response) {
                    var newGiftCard = response;
                    if (newGiftCard.giftCardRedeems.length == 0) {
                        $scope.ms.showModal('id024', 'success');
                    } else {
                        // Retrieve the last transaction by sorting
                        // the transaction array by date.
                        var transaction = _.last(
                            _.sortBy(
                                newGiftCard.giftCardRedeems,
                                function (redeem) {
                                    return new Date(redeem.timestamp).valueOf();
                                }));
                        // Check if the last transaction is really new
                        if (!_.find($scope.giftCard.giftCardRedeems, function (redeem) {
                                return transaction.id === redeem.id;
                            })) {
                            var timestamp = transaction.timestamp.split(/(-|T)/);
                            var title = 'Ooh, what did you get for $' + transaction.amount;
                            title += ' at ' + newGiftCard.businessName + ' on ';
                            title += timestamp[2] + '/' + timestamp[4] + '?';
                            $scope.ms.setMessage('id025', title);
                            $scope.ms.showModal('id025', 'rate');

                            $scope.ms.currentMessage.shareText = $scope.ms.currentMessage.tmplShareText.replace('[business name]', newGiftCard.businessName);
                            $scope.ms.currentMessage.shareTextTw = $scope.ms.currentMessage.tmplShareTextTw.replace('[business name]', newGiftCard.businessName);
                            $scope.ms.currentMessage.ratingId = {
                                type: 'REDEMPTION',
                                giftCardId: newGiftCard.id,
                                userId: $rootScope.loggedUser.id
                            };
                        } else {
                            $location.path('/');
                        }
                    }

                }, function (error) {
                    ModalService.showModal('id012', 'alert');
                });
        }
    }
})();

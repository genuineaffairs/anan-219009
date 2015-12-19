/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for the payment page
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-224] Implement user feedback
 */

(function () {
    'use strict';

    angular
        .module('app.champion.payment')
        .controller('PaymentCtrl', PaymentCtrl);

    PaymentCtrl.$inject = ['$scope', '$rootScope', 'GiftCardOfferService', 'CartService', 'ModalService',
        'pageData', 'GLOBAL_OPTIONS'];

    // Payments page controller
    function PaymentCtrl($scope, $rootScope, GiftCardOfferService, CartService, ModalService,
                         pageData, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);

        $scope.myCart = CartService;
        $scope.ms = ModalService;
        $scope.ms.offerDetails = pageData.offerDetails;
        $scope.offerDetails = pageData.offerDetails;
        var braintreeToken = pageData.brainTreeToken;
        $scope.offers = [];
        $scope.offers.push({
            id: CartService.giftOfferId,
            totalValue: CartService.totalValue
        });

        //render the payment fields using braintree plugin
        braintree.setup(braintreeToken, 'dropin', {
            container: 'dropin-container',
            paymentMethodNonceReceived: function (event, nonce) {
                GiftCardOfferService.purchase(_.map($scope.offers, function (offer) {
                    return {
                        "paymentMethodNonce": nonce,
                        "giftCardOfferId": offer.id,
                        "quantity": Number(offer.totalValue)
                    }
                })).then(function (giftCards) {
                    $scope.ms.offerDetails = pageData.offerDetails;
                    $scope.ms.redirectUrl = '/';
                    $scope.myCart.clearCart();
                    $scope.ms.showModal('id006', 'rate');
		    $scope.ms.currentMessage.ratingId = {
			type: 'PURCHASE',
			giftCardId: giftCards[0].id,
			userId: $rootScope.loggedUser.id
		    };
                }, function (reason) {
                    $scope.disabled = false;
                    $scope.ms.showModal('id001', 'alert');
                });
            }
        });
    }
})();

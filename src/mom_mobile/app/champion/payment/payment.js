/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for payment page
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.champion.payment', [
            'ngRoute',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    //payment route config
    function config($routeProvider) {
        $routeProvider
            .when('/payment', {
                templateUrl: 'champion/payment/payment.html',
                controller: 'PaymentCtrl',
                resolve: {
                    pageData: PaymentResolve,
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'Payment',
			    /* [PMP-178] Temporarily disable back
			     * button to Cart and replace it with a
			     * cancel button to / */
                            /*back: 'my-cart'*/
			    cancel: 'home'
                        }
                    }
                }
            })
    }

    PaymentResolve.$inject = ['$q', 'GiftCardOfferService', 'CartService'];

    //Get all the relevent data for payment page and inject into the controller
    function PaymentResolve ($q, GiftCardOfferService, CartService) {
        var offerDetails,
            brainTreeToken,
            promises = [],
            offerPromise,
            brainTreePromise;

        offerPromise = GiftCardOfferService.get(CartService.giftOfferId)
            .then (function (result){
                offerDetails = result;
        });
        promises.push(offerPromise);

        brainTreePromise = GiftCardOfferService.getBraintreeToken()
            .then(function (data) {
                brainTreeToken = data.token;
        });
        promises.push(brainTreePromise);

        return $q.all(promises).then(function(){
            return {
                offerDetails: offerDetails,
                brainTreeToken: brainTreeToken
            }
        });
    }

})();


/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for my cart page
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.champion.myCart', [
            'ngRoute',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    //route config for my cart page
    function config($routeProvider) {
        $routeProvider
            .when('/my-cart', {
                templateUrl: 'champion/my-cart/my-cart.html',
                controller: 'MyCartCtrl',
                resolve: {
                    pageData: MyCartResolve,
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'My Cart',
                            back: 'home'
                        }
                    }
                }
            })
    }

    MyCartResolve.$inject = ['$q', 'GiftCardOfferService', 'CartService'];

    //Get all the relevant data for my cart page and inject it into the controller
    function MyCartResolve ($q, GiftCardOfferService, CartService) {

        if ( (!CartService.giftOfferId) || CartService.giftOfferId == null) {
            var offerDefer = $q.defer();
            offerDefer.resolve(null);
            return offerDefer.promise;
        }
        var offerPromise = GiftCardOfferService.get(CartService.giftOfferId);

        return offerPromise;
    }

})();


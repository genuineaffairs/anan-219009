/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for gift card details page
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-158] In page data, also load the giftCardOffer
 */

(function () {
    'use strict';

    angular
        .module('app.champion.giftCardDetails', [
            'ngRoute',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    //route configuration for gift card details
    function config($routeProvider) {
        $routeProvider
            .when('/details/:id', {
                templateUrl: 'champion/gift-card-details/gift-card-details.html',
                controller: 'GiftCardDetailsCtrl',
                resolve: {
                    pageData: GiftCardDetailsResolve,
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'Details',
                            back: 'founder-shares'
                        }
                    }
                }
            })
    }

    GiftCardDetailsResolve.$inject = ['$route', '$q', 'GiftCardService', 'GiftCardOfferService', 'BusinessService'];

    //Get the data relevant to gift card details page and inject into the controller.
    function GiftCardDetailsResolve ($route, $q, GiftCardService, GiftCardOfferService, BusinessService) {
        var promises = [],
            result = {},
            giftCardPromise,
	    giftCardOfferDefer = $q.defer(),
            businessDefer= $q.defer();

        giftCardPromise = GiftCardService
            .getMyGiftCard($route.current.params.id)
            .then(function (data){
                result.giftCard = data;
		GiftCardOfferService
		    .get(result.giftCard.giftCardOfferId)
		    .then(function(giftCardOfferData) {
			result.giftCardOffer = giftCardOfferData;
			giftCardOfferDefer.resolve();
		    }, function(error) {
			giftCardOfferDefer.reject(error);
		    });
                BusinessService
                    .getBusiness(result.giftCard.businessId)
                    .then(function (businessData){
                        result.business = businessData;
                        businessDefer.resolve();
                    }, function(error){
                        businessDefer.reject(error);
                    });
            });

        promises.push(giftCardPromise);
	promises.push(giftCardOfferDefer.promise);
        promises.push(businessDefer.promise);

        return $q.all(promises)
            .then(function() {
                return result;
            })
    }

})();


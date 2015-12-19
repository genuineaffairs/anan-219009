/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for offers
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Implement search by type and location
 */

(function () {
    'use strict';

    angular
        .module('app.common.offers', [
            'ngRoute',
            'infinite-scroll',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    //offers route config
    function config($routeProvider) {
        $routeProvider
            .when('/',{
                templateUrl: 'common/offers/offers.html',
                controller: "OffersCtrl",
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'Gift Card Offers',
                            showMenu: true
                        }
                    },
                    offers: OffersResolve,
                    businessTypes: ["LookupService", function (LookupService) {
                        return LookupService.getAllBusinessTypes()
                    }]
                }
            })
    }

    OffersResolve.$inject = ['$route', '$location', 'GiftCardOfferService', 'appConfig', "UtilService"];
    //Get all the data relevent to load the page and inject it into the page
    function OffersResolve($route, $location, GiftCardOfferService, appConfig, UtilService) {

        //If user clicks on a offer shared using email or social media
        //route to the corresponding offer-details page
        if ( $route.current.params.hasOwnProperty('offerId') ){
            $location.path('/offer-details/'+$route.current.params.offerId);
            return;
        }
        return UtilService.getLocation().then(function (coords) {
            coords = coords || {};
            var params = {
                pageNumber: 1,
                status: 'ACTIVE',
                pageSize: appConfig.OFFERS_PER_PAGE,
                lat: coords.latitude,
                long: coords.longitude
            };
            return GiftCardOfferService.search(params).then(function (result) {
                return {
                    result: result,
                    criteria: params
                }
            });
        });
    }

})();

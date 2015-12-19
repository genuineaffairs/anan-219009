/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for offer details page
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Make 'back' url button configurable
 */

(function () {
    'use strict';

    angular
        .module('app.common.offerDetails', [
            'ngRoute',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    //route config for offer details page
    function config($routeProvider) {
        $routeProvider
            .when('/offer-details/:id', {
                templateUrl: 'common/offer-details/offer-details.html',
                controller: 'OfferDetailsCtrl',
                isPublic: true,
                resolve: {
                    pageData: OfferDetailsResolve,
                    GLOBAL_OPTIONS: ["$location", function ($location) {
                        return {
                            headless: false,
                            title: 'Details',
                            back: $location.search().back || 'home',
                            showShare: true
                        }
                    }]
                }
            })
    }

    OfferDetailsResolve.$inject = ['$q', '$route', 'GiftCardOfferService', 'BusinessService'];

    //Get all the relevant data for the offer details page and inject into the controller
    function OfferDetailsResolve ($q, $route, GiftCardOfferService, BusinessService) {
        var promises = [],
            offerPromise = GiftCardOfferService.get($route.current.params.id),
            businessDefer = $q.defer(),
            commentsDefer = $q.defer(),
            result = {};

        promises.push(offerPromise);
        promises.push(businessDefer.promise);
        promises.push(commentsDefer.promise);

        offerPromise.then(function(data) {
            result.offerDetails = data;

            BusinessService.getBusiness(result.offerDetails.businessId)
                .then(function(business) {
                    result.businessDetails = business;
                    businessDefer.resolve();
                },
                function(reason){
                    businessDefer.reject(reason);
                });
        });

        GiftCardOfferService.getComments($route.current.params.id)
            .then(function (data){
                result.comments = data;
                commentsDefer.resolve();
            },
            function(reason){
                commentsDefer.reject(reason);
            });

        return $q.all(promises)
            .then(function () {
                return result;
            })
    }

})();


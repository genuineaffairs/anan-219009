/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents services.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included new functions to get and post comments.
 *  - Included new functions to get braintree token and purchase a gift card
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('GiftCardOfferService', GiftCardOfferService);

    GiftCardOfferService.$inject = ['CommonService', 'appConfig'];

    function GiftCardOfferService(CommonService, appConfig) {
        return {


            /**
             * Get a gift card offer
             */
            get: function (id) {
                var req = {
                    url: '/giftCardOffers/' + id,
                    method: 'GET'
                };
                return CommonService.makeRequest(req);
            },

            /**
             * Search gift card offer
             */
            search: function (criteria) {
                var req = {
                    url: '/giftCardOffers',
                    method: 'GET',
                    params: criteria
                };
                return CommonService.makeRequest(req);
            },

            /**
             * Delete a gift card offer
             */
            delete: function (id) {
                var req = {
                    url: '/giftCardOffers/' + id,
                    method: 'DELETE'
                };
                return CommonService.makeRequest(req);
            },

            /**
             * Get comments of a gift card offer
             * @param id the gift card offer id
             */
            getComments: function (id) {
                var req = {
                    url: '/giftCardOffers/' + id + '/comments',
                    method: 'GET'
                };
                return CommonService.makeRequest(req);
            },

            /**
             * Purchase.
             *
             * @param giftCardOffer the gift card offer entity.
             */
            purchase: function (giftCardOffer) {
                var req = {
                    method: 'POST',
                    url: '/giftCards',
                    data: giftCardOffer
                };
                return CommonService.makeRequest(req);
            },

            /**
             * Get braintree token.
             */
            getBraintreeToken: function () {
                var req = {
                    method: 'GET',
                    url: '/giftCards/braintree/token'
                };
                return CommonService.makeRequest(req);
            },

            /**
             * Create a comment for a gift card
             * @param id the gift card offer id
             * @param comment the comment text
             */
            createComment: function (id, comment) {
                var req = {
                    method: 'POST',
                    url: '/giftCardOffers/' + id + '/comments',
                    data: {
                        "comment": comment,
                        "giftCardOfferId": id
                    }
                };
                return CommonService.makeRequest(req);
            }

        };
    }

})();



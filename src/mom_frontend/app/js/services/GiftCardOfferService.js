/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Offer Service.
 *
 * Changes in version 1.1:
 *  - Added purchase() method.
 *
 * Changes in version 1.2:
 *  - Added getBraintreeToken() method.
 *
 * Changes in version 1.3:
 *  - Combine all query parameters to filter in getAllGiftCardOffers
 *
 * Changes in version 1.4:
 *  - Added removeGiftCardOfferComment / removeGiftCardOffer / renewGiftCard method.
 * @version 1.4
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('GiftCardOfferService', ['common', function (common) {
        return {
            /**
             * Search for gift card offers
             * @param filter the filter
             */
            getAllGiftCardOffers: function (filter) {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCardOffers',
                    params: filter
                });
            },
            /**
             * Get a gift card offer
             * @param offerId the gift card offer id
             */
            getGiftCardOffer: function (offerId) {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCardOffers/' + offerId
                });
            },

            /**
             * Get comments of a gift card offer
             * @param giftCardOfferId the gift card offer id
             */
            getGiftCardOfferComments: function (giftCardOfferId) {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCardOffers/' + giftCardOfferId + '/comments'
                });
            },

            /**
             * Create a comment for a gift card
             * @param giftCardOfferId the gift card offer id
             * @param comment the comment text
             */
            createGiftCardOfferComment: function (giftCardOfferId, comment) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/giftCardOffers/' + giftCardOfferId + '/comments',
                    data: {
                        "comment": comment,
                        "giftCardOfferId": giftCardOfferId
                    }
                });
            },

            /**
             * Remove gift card offer comment.
             * @param commentId the comment id.
             * @param businessId the business id
             * @returns {Promise} the promise result
             */
            removeGiftCardOfferComment: function (commentId, businessId) {
                return common.makeRequest({
                    method: 'DELETE',
                    url: '/giftCardOffers/comments/' + commentId + '/' + businessId
                });
            },

            /**
             * Remove gift card offer.
             * @param id the offer id.
             * @returns {Promise} the promise result.
             */
            removeGiftCardOffer: function (id) {
                return common.makeRequest({
                    method: 'DELETE',
                    url: '/giftCardOffers/' + id
                });
            },

            /**
             * Create a gift card
             * @param giftCardOffer the gift card
             * @returns {promise} the promise
             */
            createGiftCard: function (giftCardOffer) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/giftCardOffers',
                    data: giftCardOffer
                });
            },
            /**
             * Update a gift card
             * @param giftCardOffer the gift card
             */
            updateGiftCard: function (giftCardOffer) {
                return common.makeRequest({
                    method: 'PUT',
                    url: '/giftCardOffers/' + giftCardOffer.id,
                    data: giftCardOffer
                });
            },

            /**
             * Purchase.
             *
             * @param giftCardOffer the gift card offer entity.
             */
            purchase: function (giftCardOffer) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/giftCards',
                    data: giftCardOffer
                });
            },
            /**
             * Get braintree token.
             */
            getBraintreeToken: function () {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCards/braintree/token'
                });
            },
            /**
             * Cancel a gift card
             * @param id the gift card id
             */
            cancelGiftCard: function (id) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/giftCardOffers/' + id + "/cancel"
                });
            },
            /**
             * Renew gift card.
             * @param id the gift card id
             * @returns {Promise} the promise result.
             */
            renewGiftCard: function (id) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/giftCardOffers/' + id + "/renew"
                });
            },
            /**
             * Add the view count.
             * @param id the gift card offer id
             * @returns {Promise} the promise result.
             */
            increaseViewCount: function (id) {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCardOffers/view/' + id
                });
            },
            /**
             * Add the shared count.
             * @param id the gift card offer id
             * @returns {Promise} the promise result.
             */
            increaseSharedCount: function (id) {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCardOffers/share/' + id
                });
            }
        };
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Service.
 *
 * @version 1.4
 * @author TCSASSEMBLER
 *
 * Changes in 1.1:
 * 1. add actions for gifting
 *
 * Changes in 1.2:
 *  - Added searchAll / searchChampions method.
 *
 * Changes in 1.3:
 *  - Remove businessId param from searchAll
 *
 * Changes in version 1.4
 * - accessToken can be passed to acceptGift
 */

angular.module("app")
    .factory('GiftCardService', ['common', function (common) {
        var service = {};
        /**
         * Search gift cards
         * @param {Object} criteria the query string criteria
         */
        service.search = function (criteria) {
            var req = {
                method: 'GET',
                url: '/users/me/giftCards?',
                params: criteria
            };
            return common.makeRequest(req);
        };

        /**
         * Search all gift cards.
         *
         * @param criteria the search condition
         * @returns {Promise} the promise result
         */
        service.searchAll = function (criteria) {
            var req = {
                method: 'GET',
                url: '/gifts',
                params: criteria
            };
            return common.makeRequest(req);
        };

        /**
         * Search gift card champion list.
         * @param id the gift card offer id.
         * @param criteria the search condition.
         * @returns {Promise} the promise result.
         */
        service.searchChampions = function (id, criteria) {
            var req = {
                method: 'GET',
                url: '/gifts/champions/' + id,
                params: criteria
            };
            return common.makeRequest(req);
        };
        /**
         * Get gift card by id
         * @param id the id
         */
        service.get = function (id) {
            var req = {
                method: 'GET',
                url: '/users/me/giftCards/' + id
            };
            return common.makeRequest(req);
        };
        /**
         * Send gift
         * @param id the id
         * @param data the data
         * @since 1.1
         */
        service.sendGift = function (id, data) {
            var req = {
                method: 'POST',
                url: '/giftCards/' + id + "/send",
                data: data
            };
            return common.makeRequest(req);
        };
        /**
         * Send gift to twitter
         * @param id the id
         * @param data the data
         * @since 1.1
         */
        service.sendGiftToTwitter = function (id, data) {
            var req = {
                method: 'POST',
                url: '/giftCards/' + id + "/send/twitter",
                data: data
            };
            return common.makeRequest(req);
        };
        /**
         * Accept gift
         * @param code the gift code
         * @since 1.1
         */
        service.acceptGift = function (code, accessToken) {
            var req = {
                method: 'POST',
                url: '/gift/' + code
            };
            if(accessToken) {
                req.headers = {};
                req.headers.Authorization = 'Bearer ' + accessToken;
            }
            return common.makeRequest(req);
        };
        /**
         * Accept gift from twitter
         * @param code the gift code
         * @param data the data
         * @since 1.1
         */
        service.acceptGiftFromTwitter = function (code, data) {
            var req = {
                method: 'POST',
                url: '/gift/' + code + "/twitter",
                data: data
            };
            return common.makeRequest(req);
        };
        return service;
    }]);
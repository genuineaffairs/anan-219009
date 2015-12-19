/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents gift card service.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Include functions to send gift to a friend using phone, email or twitter.
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('GiftCardService', GiftCardService);

    GiftCardService.$inject = ['$http', '$q', 'StorageService', 'CommonService', 'appConfig'];


    function GiftCardService($http, $q, StorageService, CommonService, appConfig) {
        return {
            getMyGiftCards: function (params) {
                return CommonService.makeRequest({
                    method: 'GET',
                    url: '/users/me/giftCards',
                    params: params
                })
            },


            getMyGiftCard: function (giftCardId) {
                return CommonService.makeRequest({
                    method: 'GET',
                    url: '/users/me/giftCards/' + giftCardId
                });
            },


            getByQRCode: function (qrCode) {
                return CommonService.makeRequest({
                    method: 'GET',
                    url: '/giftCards/' + qrCode
                });
            },

            /**
             * Redeem a gift card
             */
            redeem: function (qrCode, amount) {
                var req = {
                    method: 'POST',
                    url: '/giftCards/redeem?qrCode=' + qrCode + '&amount=' + amount
                };
                return CommonService.makeRequest(req);
            },

            getTotalRedeemedAmount: function (ownerId) {
                var deferred = $q.defer();
                var accessToken = StorageService.getSessionToken();
                // prepare request object
                var req = {
                    method: 'GET',
                    url: '/users/totalredeemed?ownerId=' + ownerId,
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                };
                $http(req).then(function (payload) {
                    deferred.resolve(payload.data);
                }, function (reason) {
                    deferred.reject(reason);
                });
                return deferred.promise;
            },

            /**
             * Accept gift
             * @param code the gift code
             * @since 1.1
             */
            acceptGift: function (code) {
                var req = {
                    method: 'POST',
                    url: '/gift/' + code
                };
                return CommonService.makeRequest(req);
            },

            /**
             * Accept gift from twitter
             * @param code the gift code
             * @param data the data
             * @since 1.1
             */
            acceptGiftFromTwitter: function (code, data) {
                var req = {
                    method: 'POST',
                    url: '/gift/' + code + "/twitter",
                    data: data
                };
                return CommonService.makeRequest(req);
            },

            /**
             * Send gift
             * @param id the id
             * @param data the data
             * @since 1.1
             */
            sendGift: function (id, data) {
                var req = {
                    method: 'POST',
                    url: '/giftCards/' + id + "/send",
                    data: data
                };
                return CommonService.makeRequest(req);
            },
            /**
             * Send gift to twitter
             * @param id the id
             * @param data the data
             * @since 1.1
             */
            sendGiftToTwitter: function (id, data) {
            var req = {
                method: 'POST',
                url: '/giftCards/' + id + "/send/twitter",
                data: data
            };
            return CommonService.makeRequest(req);
        }

        }
    }


})();



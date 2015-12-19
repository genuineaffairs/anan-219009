/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Lookup Service.
 *
 * Changes in version 1.1 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-206] Add #getPlatformGiftCardOfferConditions
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('LookupService', ['config', '$http', '$q', function (config, $http, $q) {
        var service = {};

        /**
         * Get all business types
         */
        service.getAllBusinessTypes = function () {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/businessTypes'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get all feedback types
         */
        service.getAllFeedbackTypes = function () {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/feedbackTypes'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get all action types
         */
        service.getAllActionTypes = function () {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/actionTypes'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get all offer categories
         */
        service.getAllOfferCategories = function () {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/offerCategories'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

	/**
	 * Get default platform conditions for gift card offers
	 */
	service.getPlatformGiftCardOfferConditions = function() {
	    var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/platformConditions'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
	};

        return service;
    }]);

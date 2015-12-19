/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents services.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('BusinessService', BusinessService);

    BusinessService.$inject = ['CommonService'];

    function BusinessService(CommonService) {
        var service = {};

        service.getBusiness = function (id) {
            var req = {
                method: 'GET',
                url: '/businesses/' + id
            };
            return CommonService.makeRequest(req);
        };

        service.search = function (filter) {
            var req = {
                method: 'GET',
                url: '/businesses',
                params: filter
            };
            return CommonService.makeRequest(req);
        };

        service.getMyBusiness = function () {
            var req = {
                method: 'GET',
                url: '/businesses/me'
            };
            return CommonService.makeRequest(req);
        };
        /**
         * Get business activities related to current business
         * @param criteria the search criteria
         * @returns {Promise}
         * @since 1.3
         */
        service.getMyBusinessActions = function (criteria) {
            var req = {
                method: 'GET',
                url: '/businesses/me/actions',
                params: criteria
            };
            return CommonService.makeRequest(req);
        };
        return service;
    }

})();



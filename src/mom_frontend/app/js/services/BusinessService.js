/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Business service.
 *
 * Changes in version 1.1:
 *  - Added updateMyBusinessProfile() method.
 *
 * Changes in version 1.2:
 *  - Updated verification logic.
 *
 * Changes in version 1.3:
 *  - Added getAllBusinessActions method.
 * @version 1.3
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('BusinessService', ['config', '$http', '$q', 'common', function (config, $http, $q, common) {
        var service = {};

        service.getBusiness = function (id) {
            var req = {
                method: 'GET',
                url: '/businesses/' + id
            };
            return common.makeRequest(req);
        };
        
        service.search = function (filter) {
            var req = {
                method: 'GET',
                url: '/businesses',
                params: filter
            };
            return common.makeRequest(req);
        };

        service.getMyBusiness = function () {
            var req = {
                method: 'GET',
                url: '/businesses/me'
            };
            return common.makeRequest(req);
        };

        service.getMyBusinessActions = function (criteria) {
            var req = {
                method: 'GET',
                url: '/businesses/me/actions',
                params: criteria
            };
            return common.makeRequest(req);
        };

        /**
         * Get all business actions.
         * @param criteria the search condition
         * @returns {Promise} the promise result.
         */
        service.getAllBusinessActions = function (criteria) {
            var req = {
                method: 'GET',
                url: '/businesses/all/actions',
                params: criteria
            };
            return common.makeRequest(req);
        };

        service.payForVerification = function (merchantAccountParams, paymentInfo) {
            var req = {
                method: 'POST',
                url: '/businesses/me/verify',
                data: {
                    merchantAccountParams: merchantAccountParams,
                    paymentInfo: paymentInfo
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Verify business by platform role.
         * @param businessId the business id.
         */
        service.verifyByPlatformAdmin = function (businessId) {
            var req = {
                method: 'POST',
                url: '/businesses/' + businessId + '/platform/verify'
            };
            return common.makeRequest(req);
        };

        service.getBusinessEmployees = function () {
            var req = {
                method: 'GET',
                url: '/businesses/me/employees'
            };
            return common.makeRequest(req);
        };

        service.addBusinessEmployees = function (employee) {
            var req = {
                method: 'POST',
                url: '/businesses/me/employees',
                data: employee
            };
            return common.makeRequest(req);
        };

        service.deleteBusinessEmployee = function (id) {
            var req = {
                method: 'DELETE',
                url: '/businesses/me/employees/' + id
            };
            return common.makeRequest(req);
        };

        service.updateBusinessEmployee = function (id, employee) {
            var req = {
                method: 'PUT',
                url: '/businesses/me/employees/' + id,
                data: employee
            };
            return common.makeRequest(req);
        };

        /**
         * Update my business profile.
         * @param business the business entity
         */
        service.updateMyBusinessProfile = function (business, image) {
            var values = _.pick(business, 'name', 'type', "streetAddress", "city", "state", "country", "zip", 'telephoneNumber', 'businessHours', 'description', 'website');
            var data = new FormData();
            if (image) {
                data.append('image', image);
            }
            _.each(values, function (value, name) {
                data.append(name, value);
            });
            var req = {
                method: 'PUT',
                url: '/businesses/me',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            return common.makeRequest(req);
        };

        service.createMyBusinessProfile = function (business) {
            var req = {
                method: 'POST',
                url: '/businesses/me',
                data: business
            };
            return common.makeRequest(req);
        };
        return service;
    }]);
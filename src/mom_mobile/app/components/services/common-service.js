/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents common service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('CommonService', CommonService);

    CommonService.$inject = ['$http', '$q', '$log', 'StorageService', '$injector', 'appConfig'];

    function CommonService($http, $q, $log, StorageService, $injector, appConfig) {
        var alertTimeout;
        return {
            /**
             * Make an http request and add access token
             * @param {Object} options the options for $http call
             * @returns {Promise} promise
             */
            makeRequest: function (options) {
                var deferred = $q.defer();
                var accessToken = StorageService.getSessionToken();
                if (!options.headers) {
                    options.headers = {};
                }
                if (accessToken && !options.headers.Authorization) {
                    options.headers.Authorization = 'Bearer ' + accessToken;
                }
                options.url = appConfig.REST_SERVICE_BASE_URL + options.url;
                $http(options)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(status, config.method, config.url, data);
                        if (data && (data.error === 'Session Token not found' || data.error === 'Session Token Expired')) {
                            $injector.get('UtilService').logout();
                            //it won't alert multiple times if there were parallel requests
                            if (alertTimeout) {
                                return;
                            }
                            setTimeout(function () {
                                alertTimeout = false;
                            }, 5000);
                            alertTimeout = true;
                            setTimeout(function () {
                                alert("Your session has expired. Please log in.");
                            }, 100);
                            return;
                        }
                        deferred.reject(data || {"error": "Unknown error"});
                    });
                return deferred.promise;
            }
        }
    }


})();



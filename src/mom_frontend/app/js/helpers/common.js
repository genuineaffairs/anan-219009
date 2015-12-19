/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * The service helper
 *
 * Changes in 1.1:
 *  - Handle expired session token
 *
 * Changes in version 1.2
 * - Replace native javascript alert with notify
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */
'use strict';


angular.module("app")
    .factory('common', ['$http', '$q', '$log', 'storage', 'config', '$injector', 'notify', function ($http, $q, $log, storage, config, $injector, notify) {
        var alertTimeout;
        return {
            /**
             * Make an http request and add access token
             * @param {Object} options the options for $http call
             * @returns {Promise} promise
             */
            makeRequest: function (options) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                if (!options.headers) {
                    options.headers = {};
                }
                if (accessToken && !options.headers.Authorization) {
                    options.headers.Authorization = 'Bearer ' + accessToken;
                }
                if (options.url.indexOf("http") !== 0) {
                    options.url = config.REST_SERVICE_BASE_URL + options.url;
                }
                $http(options)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(status, config.method, config.url, data);
                        if (data && (data.error === 'Session Token not found' || data.error === 'Session Token Expired')) {
                            $injector.get('util').logout();
                            //it won't alert multiple times if there were parallel requests
                            if (alertTimeout) {
                                return;
                            }
                            setTimeout(function () {
                                alertTimeout = false;
                            }, 5000);
                            alertTimeout = true;
                            setTimeout(function () {
                                notify({message: "Your session has expired. Please log in.", templateUrl: 'partials/module/notify-popup.html'});
                            }, 100);
                            return;
                        }
                        deferred.reject(data || {"error": "Unknown error"});
                    });
                return deferred.promise;
            }
        }
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Data service for unimplemented pages.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//factory for Data
angular.module("app")
    .factory('DataService', ['$http', '$q', function ($http, $q) {
        return {
            query: function (fileName) {
                var deferred = $q.defer();
                $http({method: 'GET', url: 'data/' + fileName + '.json'}).
                    success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }
        };
    }]);

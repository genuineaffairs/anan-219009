/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents base64 service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('Base64Service', Base64Service);

    /**
     * This service encapsulates the btoa() and atob() javascript functions for binary to base64 encode/decode
     */
    function Base64Service() {
        var service = {};
        /**
         * Encode a binary string data into base64 string
         */
        service.encode = function (data) {
            return btoa(data);
        };
        /**
         * Decodes a base64 string data into binary string data.
         */
        service.decode = function (data) {
            return atob(data);
        };

        return service;
    }


})();



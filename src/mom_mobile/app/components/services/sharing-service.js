/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Sharing Service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */


(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('SharingService', SharingService);

    SharingService.$inject = ['CommonService'];

    function SharingService(CommonService) {
        var service = {};

        /**
         * Share content to social network
         * @param type the social network type
         * @param content the text to share
         */
        service.share = function (type, content) {
            var req = {
                method: 'POST',
                url: '/sharing/share',
                data: {
                    type: type,
                    content: content
                }
            };
            return CommonService.makeRequest(req);
        };

        return service;
    }

})();

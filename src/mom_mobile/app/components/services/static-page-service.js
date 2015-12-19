/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Static page service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('StaticPageService', StaticPageService);

    StaticPageService.$inject = ['CommonService'];

    function StaticPageService(CommonService) {
        var service = {};

        service.getPageByName = function (name) {
            var req = {
                method: 'GET',
                url: '/staticPages/' + name
            };
            return CommonService.makeRequest(req);
        };
        return service;
    }

})();



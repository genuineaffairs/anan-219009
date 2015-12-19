/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Champion service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('ChampionService', ['config', '$http', '$q', 'common', function (config, $http, $q, common) {
        var service = {};
        /**
         * Get my champion Profile
         */
        service.getMyChampionProfile = function () {
            var req = {
                method: 'GET',
                url: '/champions/me'
            };
            return common.makeRequest(req);
        };

        /**
         * Update my champion profile.
         * @param champion the champion entity
         * @param image the image to upload
         */
        service.updateMyChampionProfile = function (champion, image) {
            var values = _.pick(champion, 'isPicturePublic', 'autoShare');
            var data = new FormData();
            if (image) {
                data.append('image', image);
            }
            _.each(values, function (value, name) {
                data.append(name, value);
            });
            var req = {
                method: 'PUT',
                url: '/champions/me',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            return common.makeRequest(req);
        };

        return service;
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Sharing Service.
 *
 * Changes in 1.1 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - Added shareOffline
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */


angular.module("app")
    .factory('SharingService', ['common', '$q', function (common, $q) {
        var service = {}, localConnection;

        service.api2authType = {
            FACEBOOK: "facebook",
            TWITTER: "twitter",
            LINKEDIN: "linkedin2"
        };
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
            return common.makeRequest(req);

        };

        service.shareOffline = function(type, content) {
            var details = {};
            if(type === 'FACEBOOK') {
                details.url = 'me/feed';
                details.data = {
                    message: content.message,
                    picture: content.image,
                    link: content.link,
                    name: content.name,
                    description: content.description,
                    caption: content.caption
                }
            } else if (type === 'TWITTER') {
                details.url = '/1.1/statuses/update.json';
                details.data = {status: content.message}
            } else if (type === 'LINKEDIN') {
                details.url = '/v1/people/~/shares?format=json';
                details.data = {
                    comment: content.message,
                    visibility: {
                        code: "anyone"
                    },
                    content: {
                        "submitted-url": content.link,
                        "title": content.name,
                        "description": content.description,
                        "submitted-image-url": content.image
                    }
                };
            } else {
                return console.log("Not supported type: " + type);
            }
            return localConnection.post(details.url, {data: details.data});
        };

        service.addLocalConnection = function (type) {
            return OAuth.popup(service.api2authType[type]).done(function(request) {
                return localConnection = request;
            })
        };
        return service;
    }]);

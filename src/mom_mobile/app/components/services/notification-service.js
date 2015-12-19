/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents notification service.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included function to send invitations to friend using email
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('NotificationService', NotificationService);

    NotificationService.$inject = ['CommonService'];

    function NotificationService(CommonService) {
        var service = {};

        /**
         * Send an invitation email to a friend
         * @param friendInvitation the friend invitation
         */
        service.invitations = function (friendInvitation) {
            var req = {
                method: 'POST',
                url: '/invitations/',
                data: {
                    "friendEmail": friendInvitation.friendEmail,
                    "offerId": friendInvitation.offerId,
                    "offerTitle": friendInvitation.offerTitle
                }
            };
            return CommonService.makeRequest(req);
        };

        /**
         * Get all business types
         */
        service.notifyAdminOfReportedAbuse = function (reportedAbuse) {
            var req = {
                method: 'POST',
                url: '/reportAbuse',
                data: reportedAbuse
            };
            return CommonService.makeRequest(req);
        };

        return service;
    }

})();



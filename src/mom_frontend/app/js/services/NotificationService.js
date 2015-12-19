/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Notification Service.
 *
 * Changes in version 1.1:
 *  - Added sendFeedback() and reportAbuse() method.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('NotificationService', ['config', '$rootScope', 'common', function (config, $rootScope, common) {
        return {
            /**
             * Send an invitation email to a friend
             * @param friendInvitation the friend invitation
             */
            invitations: function (friendInvitation) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/invitations/',
                    data: {
                        "friendEmail": friendInvitation.friendEmail,
                        "offerId": friendInvitation.offerId,
                        "offerTitle": friendInvitation.offerTitle
                    }
                });
            },

            /**
             * Send feed back email.
             * @param feedback the feedback entity
             */
            sendFeedback: function (feedback) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/feedbacks',
                    data: feedback
                });
            },
            /**
             * Report abused email.
             * @param report the report entity
             */
            reportAbuse: function (report) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/reportAbuse',
                    data: report
                });
            }
        };
    }]);

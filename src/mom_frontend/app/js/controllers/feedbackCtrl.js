/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Feedback controller.
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 * - Change feedback popup text
 *
 * Changes in 1.2
 * - Only logged in users can give feedback.
 *
 * Changes in version 1.3 (Project Mom and Pop - MiscUpdate5):
 * - Feedback message is optional
 * - Disable send button while sending feedback
 * - Fix validation error when subject is only white spaces
 */

angular.module("app")
    .controller("feedbackCtrl", ['$scope', '$rootScope', '$location', 'NotificationService', 'LookupService', 'storage', '$log', 'notify', 'util', '$analytics',
        function ($scope, $rootScope, $location, NotificationService, LookupService, storage, $log, notify, util, $analytics) {
            /**
             * If not logged in, go to login page and
             * redirect to provide feedback page after
             * successful login.
             */
            if (!util.isLoggedIn()) {
                $rootScope.tmp = {};
                $rootScope.tmp.redirectUrl = '/ProvideFeedback';
                $location.path('/Login');
            }

            $scope.feedbackType = {};
            $scope.message = '';
            $scope.subject = '';
            $scope.feedbackTypes = [];
            $scope.feedbackSending = false;


            LookupService.getAllFeedbackTypes().then(function (data) {
                $scope.feedbackTypes = data;
                $scope.feedbackType = {'name': $scope.feedbackTypes[0].name, 'id': $scope.feedbackTypes[0].id};
            }, function (data) {
                notify({message: data, templateUrl: 'partials/module/notify-popup.html'});
                $log.log(data);
            });

            /**
             * Send feedback.
             */
            $scope.send = function () {
                if ($scope.feedbackSending) {
                    return;
                }
                $scope.submitted = false;
                if (!$scope.subject || $scope.subject.trim().length === 0) {
                    $scope.feedbackSending = false;
                    $scope.submitted = true;
                } else {
                    $scope.feedbackSending = true;
                    NotificationService.sendFeedback({
                        "subject": $scope.subject,
                        "message": $scope.message,
                        "type": Number($scope.feedbackType.id)
                    }).then(function (data) {
                        $scope.feedbackSending = false;
                        $scope.subject = '';
                        $scope.message = '';
                        notify({
                            message: "Your feedback was successfully sent. We appreciate it!",
                            templateUrl: 'partials/module/notify-popup.html'
                        });
                        $analytics.eventTrack($scope.feedbackType.name, {  category: 'Feedback' });
                    }, function (reason) {
                        notify({message: "Fail to send feedback.", templateUrl: 'partials/module/notify-popup.html'});
                        $log.log(reason);
                    });
                }
            };
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Report abuse controller.
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("reportAbuseCtrl",
		['$scope', '$rootScope', '$routeParams', '$location', 'NotificationService', 'storage', '$log', 'notify', 'util',
		 function ($scope, $rootScope, $routeParams, $location, NotificationService, storage, $log, notify, util) {
	    /**
	     * If not logged in, go to login page and
	     * redirect to report abuse page after
	     * successful login.
	     */
	    if(!util.isLoggedIn()) {
		$rootScope.tmp = {};
		$rootScope.tmp.redirectUrl = $location.url();
		$location.path('/Login');
	    }

	    $scope.issue = '';
            $scope.describe = '';

            /**
             * Send the abuse email.
             */
            $scope.send = function () {
                $scope.submitted = false;
                if ($scope.issue.trim().length === 0 || $scope.describe.trim().length === 0) {
                    $scope.submitted = true;
                } else {
                    var reportedAbuse = {};
                    reportedAbuse.issue = $scope.issue;
                    reportedAbuse.description = $scope.describe;
                    if ($routeParams.giftCardOfferId) {
                        reportedAbuse.giftCardOfferId = $routeParams.giftCardOfferId;
                    }

                    NotificationService.reportAbuse(reportedAbuse).then(function (data) {
                        $scope.issue = '';
                        $scope.describe = '';
                        $scope.reportModal = $rootScope.modal = true;
                    }, function (reason) {
                        notify({message: 'Fail to send abuse report, please refer to log for detail.', templateUrl: 'partials/module/notify-popup.html'});
                        $log.log(reason);
                    });
                }
            };

            /**
             * Close modal.
             */
            $scope.done = function () {
                $scope.submitted = $scope.reportModal = $rootScope.modal = false;
		$location.path('/Home');
            };
            /**
             * Close modal.
             */
            $scope.closeModal = function () {
                $scope.submitted = $scope.reportModal = $rootScope.modal = false;
            };
        }]);

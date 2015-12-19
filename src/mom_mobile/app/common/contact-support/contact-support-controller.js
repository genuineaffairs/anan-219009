
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for abuse page
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Change name from abuse to contact-support
 *
 * Changes in 1.2
 *  - Disable the button while processing notification.
 *  - Clear the form on successful processing of notification
 *
 * Changes in version 1.3 (Project Mom and Pop - MiscUpdate5):
 *  - Redirect back to last page
 */

(function () {
    'use strict';

    angular
        .module('app.common.contactSupport')
        .controller('ContactSupportCtrl', ContactSupportCtrl);


    ContactSupportCtrl.$inject = ['$scope', '$rootScope', '$location', 'ModalService', 'NotificationService', 'StorageService', 'UtilService', 'GLOBAL_OPTIONS', '$analytics'];


    function ContactSupportCtrl($scope, $rootScope, $location, ModalService, NotificationService, StorageService, UtilService, GLOBAL_OPTIONS, $analytics) {
	if(!UtilService.isLoggedIn()) {
	    $rootScope.tmp = {};
	    $rootScope.tmp.redirectUrl = '/contact-support';
	    $location.path('/login');
	}
	
       $scope.resetGlobal(GLOBAL_OPTIONS);
       $scope.vm = {};
       $scope.vm.disable = false;
       $scope.vm.sendIssue = sendIssue;

       return;

       // post contact support issue to the backend
        function sendIssue () {
            $scope.disable = true;

            var profile = StorageService.getCurrentUserProfile();

            var issue = {
                issue: $scope.vm.issue,
                description: $scope.vm.issueDescription,
                userId: profile.id
            };

            NotificationService.notifyAdminOfReportedAbuse(issue)
                .then(function () {
                    $scope.vm.issue = '';
                    $scope.vm.issueDescription = '';
                    $scope.disable = false;
		    ModalService.showModal('id021', 'shareSuccess');
                    $analytics.eventTrack(issue.issue, {  category: 'Feedback' });

                    
                    // Redirect back to last page
		    ModalService.redirectUrl = $rootScope.redirectUrl;
		    delete $rootScope.redirectUrl;
                }, function() {
                    ModalService.showModal('id022', 'errorSupport');
                    $scope.disable = false;
                });
        }
    }
})();

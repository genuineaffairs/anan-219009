/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for verify email page
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Modified $rootScope.tmp from undefined to {}
 *
 * Changes in version 1.2:
 * - [PMP-251] Fix gift open process
 */

(function () {
    'use strict';

    angular
        .module('app.common.signUp')
        .controller('VerifyEmailCtrl', VerifyEmailCtrl);

    VerifyEmailCtrl.$inject = ['$scope', '$routeParams', 'UserService', '$rootScope', '$location', 'StorageService', '$log', 'ModalService', 'GiftCardService'];

    // Controller for verify email
    function VerifyEmailCtrl($scope, $routeParams, UserService, $rootScope, $location, StorageService, $log, ModalService, GiftCardService) {
        UserService.verifyEmail($routeParams.userId, $routeParams.token).then(function (result) {
            $rootScope.tmp = {};
            $scope.loginHandler(result.sessionToken, false, function() {
		$location.path('/founder-shares');
	    });
        }, function (reason) {
            $scope.showErrorAlert(reason.error);
        });
    }
})();

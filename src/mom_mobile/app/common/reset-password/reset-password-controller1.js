/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definition for reset password step 1
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.common.resetPassword')
        .controller('ResetPasswordCtrl', ResetPasswordCtrl);

    ResetPasswordCtrl.$inject = ['$scope', '$location', '$rootScope', '$log', 'SecurityService','GLOBAL_OPTIONS'];

    // resetPasswordCtrl
    function ResetPasswordCtrl($scope, $location, $rootScope, $log, SecurityService, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);
        $scope.mail = '';

        // validate before submit
        $scope.submitValidate = function () {
            if ($scope.resetPasswordForm.$valid) {
                // send the password reset link to user email address
                SecurityService.recoverPassword($scope.mail).then(function (data) {
                    $rootScope.showInformation('Password reset link has been sent to your email.\nKindly follow URL link to reset password.')
                        .result.then(
                        function () {
                            $location.path('/');
                        },
                        function () {
                            $location.path('/');
                        }
                    );
                }, function (reason) {
                    $log.error('Error sending reset password link HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
                });
            }
        };
    }
})();

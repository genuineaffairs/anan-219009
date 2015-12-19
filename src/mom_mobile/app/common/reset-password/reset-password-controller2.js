/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for reset password step 2
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.common.resetPassword')
        .controller('ResetPasswordStepTwoCtrl', ResetPasswordStepTwoCtrl);

    ResetPasswordStepTwoCtrl.$inject = ['$scope', '$location', 'SecurityService', 'SignUpService', 'appConfig', 'GLOBAL_OPTIONS'];

    // reset password step two controller
    function ResetPasswordStepTwoCtrl($scope, $location, SecurityService, SignUpService, appConfig, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);
        // get reset password token from query string
        var params = $location.search();
        var resetPasswordToken = params.token;
        $scope.validateErrorMsg = '';
        $scope.passwordLen = appConfig.PASSWORD_LENGTH + 1;
        $scope.isElementInvalid = function(element) {
            return element.$touched && element.$invalid;
        };

        // add check confirm password function to $scope.
        SignUpService.checkConfirmPassword($scope);

        $scope.checkPassword = function () {
            $scope.resetPasswordForm.confirmPassword.$setValidity('noMatch', $scope.checkConfirmPassword());
            $scope.resetPasswordForm.password.$setValidity('badContent', SecurityService.checkPasswordContent($scope.password));
        };


        // tool function for validate form data
        $scope.validate = function () {

            if ($scope.resetPasswordForm.$invalid) {
                $scope.showError = true;
            } else {
                // call backend API to reset the password
                SecurityService.resetForgottenPassword(resetPasswordToken, $scope.confirmPassword).then(function (data) {
                    $scope.loginHandler(data.sessionToken, false);
                }, function (reason) {
                    alert(reason.error);
                });
            }

            $scope.afterClickSubmit = true;
        };
    }

})();

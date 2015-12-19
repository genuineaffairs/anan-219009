/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Reset Password Controller
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("resetPasswordCtrl", ['$scope', '$location', 'SecurityService', 'util', 'config', '$rootScope', 'notify', function ($scope, $location, SecurityService, util, config, $rootScope, notify) {
        // get reset password token from query string
        var params = $location.search();
        var resetPasswordToken = params.token;
        $scope.submit = function () {
            if ($scope.form.$valid) {
                $scope.submitted = false;
            } else {
                $scope.submitted = true;
                return;
            }
            if (SecurityService.checkPasswordLength($scope.confirm_password)) {
                notify({message: 'The password must have more than ' + config.PASSWORD_LENGTH + ' chars.', templateUrl: 'partials/module/notify-popup.html'});
                return;
            }
            if (!(SecurityService.checkPasswordContent($scope.confirm_password))) {
                notify({message: 'The password must contain both numbers and chars.', templateUrl: 'partials/module/notify-popup.html'});
                return;
            }

            // call backend API to reset the password
            SecurityService.resetForgottenPassword(resetPasswordToken, $scope.confirm_password).then(function (ret) {
                $rootScope.tmp = undefined;
                util.loginHandler(ret.sessionToken);
            }, function (reason) {
                notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
            });
        }
    }]);
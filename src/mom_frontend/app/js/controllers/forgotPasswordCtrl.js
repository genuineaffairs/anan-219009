/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Forgot Password Controller
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("forgotPasswordCtrl", ['$scope', '$rootScope', '$location', 'SecurityService', 'notify', function ($scope, $rootScope, $location, SecurityService, notify) {
        // set redirect url to null
        if($rootScope.tmp) {
            delete $rootScope.tmp.redirectUrl;
        }
        $rootScope.modal = true;
        $scope.closeModal = function () {
            $rootScope.modal = false;
        };
        $scope.submit = function () {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                // send the password reset link to user email address
                SecurityService.recoverPassword($scope.email).then(function () {
                    $rootScope.modal = false;
                    notify({message: 'Please check your email and open reset link.', templateUrl: 'partials/module/notify-popup.html' });
                    $location.path('/');
                }, function (reason) {
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html' });
                });
            }
        }
    }]);
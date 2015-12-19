/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Stop Email Verification reminders
 *
 * @author TCSASSEMBLER
 * @version 1.0
 */
angular.module("app")
    .controller("verifyEmailStopCtrl", ['$scope', '$routeParams', 'UserService', '$rootScope', 'notify', '$location', function ($scope, $routeParams, UserService, $rootScope, notify, $location) {

        UserService.verifyEmailStop($routeParams.userId, $routeParams.token).then(function (result) {
            $location.path('/');
            notify({message: result.message, templateUrl: 'partials/module/notify-popup.html'});
        }, function (reason) {
            $rootScope.tmp = {
                redirectUrl: '/'
            };
            notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
        });

    }]);

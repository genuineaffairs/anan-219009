/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Verify platform employee controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('VerifyPlatformEmployeeCtrl', ['$scope', '$rootScope', 'UserService', '$location', 'util', 'notify',
        function ($scope, $rootScope, UserService, $location, util, notify) {
            var params = $location.search();
            if(params && params.token) {
                UserService.verifyPlatformAdmin(params.token).then(function(data) {
                    if($rootScope.tmp) {
                        delete $rootScope.tmp.redirectUrl;
                    }
                    util.loginHandler(data.sessionToken);
                }, function() {
                    notify({message: 'Error verifying account. Try again later', templateUrl: 'partials/module/notify-popup.html'});
                    $location.path('#/');
                });
            }
        }
    ]);
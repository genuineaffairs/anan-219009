/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Add employee controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('addPlatformAdminCtrl', ['$scope', 'UserService', '$route', 'adminList', 'notify',
        function ($scope, UserService, $route, adminList, notify) {
            $scope.adminList = adminList;
            $scope.showPasswordModal = false;

            var doProcess = function() {
                if($scope.operation === 'add') {
                    UserService.addPlatformAdmin($scope.user, $scope.password).then(function() {
                        notify({message: 'Platform employee added successfully', templateUrl: 'partials/module/notify-popup.html'});
                        $route.reload();
                    }, function(reason) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        $route.reload();
                    });
                } else if($scope.operation === 'delete') {
                    UserService.deletePlatformAdmin($scope.employee.id, {password: $scope.password}).then(function() {
                        notify({message: 'Platform employee deleted successfully', templateUrl: 'partials/module/notify-popup.html'});
                        $route.reload();
                    }, function(reason) {
                       notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                       $route.reload();
                    });
                }
                delete $scope.password;
            }

            /**
             * Controller function to delete platform admin
             * This is click listener for delete link
             */
            $scope.deleteAdmin = function(employee) {
                $scope.showPasswordModal = true;
                $scope.operation = 'delete';
                $scope.employee = employee;
            };

            /**
             * Controller function to add a platform admin
             * This is button click listener for add button
             */
            $scope.addAdmin = function(user) {
                if(!user || !user.firstName || !user.email) {
                    notify({message: 'Enter a valid email address and first name', templateUrl: 'partials/module/notify-popup.html'});
                    return;
                }
                $scope.showPasswordModal = true;
                $scope.operation = 'add';
                $scope.user = user;
            };

            /**
             * Close the modal popup
             */
            $scope.closeModal = function() {
                $scope.showPasswordModal = false;
            };
            /**
             * Process the operation
             */
            $scope.submit = function() {
                $scope.showPasswordModal = false;
                if($scope.password) {
                    doProcess();
                } else {
                    notify({message: 'Enter a valid password', templateUrl: 'partials/module/notify-popup.html'});
                }
            };
        }
    ]);
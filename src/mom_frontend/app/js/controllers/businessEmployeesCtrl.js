/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Business employee controller.
 *
 * Changes in version 1.1:
 *  - Fixed the integrated issues.
 *
 * Changes in version 1.2:
 *  - Updated the add employee logic.
 *
 * Changes in version 1.3:
 * - Switch to read mode only if updated employee was successfully created/updated
 *
 * Changes in version 1.4
 * - Replace native javascript alerts with notify
 *
 * Changes in version 1.5 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - Make the password field optional when updating an employee
 *
 * @version 1.5
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("businessEmployeesCtrl", ['$scope', 'BusinessService', 'notify',
	function ($scope, BusinessService, notify) {
	    $scope.businessName = "";
	    $scope.currentIndexFlag = 0;
	    $scope.password = {
		placeholder: "*******"
	    };
            /**
             * Load entities.
             */
            $scope.loadEntities = function () {
                BusinessService.getBusinessEmployees().then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].flag = false;
                        data[i].username = data[i].email;
                        data[i].passwordEmpty = true;
                    }
                    $scope.employeesList = data;


                }, function (reason) {
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            $scope.loadEntities();
            BusinessService.getMyBusiness().then(function (business) {
                $scope.businessName = business.name.replace(/ /g,'');
            }, function () {
                notify({message: "Cannot get business", templateUrl: 'partials/module/notify-popup.html'});
            });
            /**
             * Added item.
             */
            $scope.add = function () {
                var item = {
                    "firstName": "",
                    "lastName": "",
                    "username": $scope.businessName,
                    "password": "",
                    "flag": true,
		    isNew: true,
                    passwordEmpty: true,
                    nameEmpty: true,
                    usernameEmpty: true,
                    lastNameEmpty: true
                };
                $scope.employeesList.push(item);
		$scope.password.placeholder = "";
            };

            /**
             * Modified item.
             * @param idx the item id
             */
            $scope.update = function (idx) {
                $scope.employeesList[idx].flag = true;
		$scope.password.placeholder = "*******";
            };

            /**
             * Validated changes.
             * @param idx the item id.
             */
            $scope.validateChange = function (idx) {
                if ($scope.employeesList[idx].firstName.trim() === '') {
                    $scope.employeesList[idx].nameEmpty = true;
                } else {
                    $scope.employeesList[idx].nameEmpty = false;
                }

                if ($scope.employeesList[idx].lastName.trim() === '') {
                    $scope.employeesList[idx].lastNameEmpty = true;
                } else {
                    $scope.employeesList[idx].lastNameEmpty = false;
                }

                if (($scope.employeesList[idx].username.trim() === '')) {
                    $scope.employeesList[idx].usernameEmpty = true;
                } else {
                    $scope.employeesList[idx].usernameEmpty = false;
                }
		
		if (($scope.employeesList[idx].isNew &&
		     $scope.employeesList[idx].password.trim() === '')) {
		    $scope.employeesList[idx].passwordEmpty = true;
                } else {
                    $scope.employeesList[idx].passwordEmpty = false;
                }
            };
            /**
             * Saved item.
             * @param idx the item id
             */
            $scope.save = function (idx) {
                // validation
                if ($scope.employeesList[idx].firstName.trim() === ''
		    || $scope.employeesList[idx].lastName.trim() === ''
                    || $scope.employeesList[idx].username.trim() === ''
		    || ($scope.employeesList[idx].isNew &&
			$scope.employeesList[idx].password.trim() === '')) {
                    return;
                }

                $scope.currentIndexFlag = idx;

                if ($scope.employeesList[idx].id) {
                    // update
                    BusinessService.updateBusinessEmployee($scope.employeesList[idx].id, $scope.employeesList[idx]).then(function () {
                        delete $scope.employeesList[idx].flag;
			if ($scope.employeesList[idx].isNew) {
			    delete $scope.employeesList[idx].isNew;
			}
                        //load entity
                        $scope.loadEntities();
                    }, function (reason) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        $scope.employeesList[idx].flag = true;
                    });
                }
                else {
                    var entity = _.pick($scope.employeesList[idx], 'firstName', 'lastName', 'username', 'password');
                    BusinessService.addBusinessEmployees(entity).then(function () {
                        delete $scope.employeesList[idx].flag;
                        $scope.loadEntities();
                    }, function (reason) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        $scope.employeesList[idx].flag = true;
                    });
                }

            };
            /**
             * Delete item.
             * @param idx the item id.
             */
            $scope.delete = function (idx) {
                if ($scope.employeesList[idx].id) {
                    BusinessService.deleteBusinessEmployee($scope.employeesList[idx].id).then(function (data) {
                        //load entity
                        $scope.loadEntities();
                    }, function (reason) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                    });
                } else {
                    $scope.employeesList.splice(idx, 1);
                }
            };
        }]);

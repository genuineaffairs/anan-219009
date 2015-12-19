/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Founder status controller.
 *
 * Changes in version 1.1:
 *  - Refractor the founder status page.
 *
 * Changes in version 1.2:
 *  - Added showHistory() method.
 *
 * Changes in version 1.3
 * - Replace native javascript alert with notify
 *
 * @version 1.3
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("founderStatusCtrl", ['$scope', 'UserService', 'BusinessService', '$rootScope', 'notify',
        function ($scope, UserService, BusinessService, $rootScope, notify) {

            function loadItems() {
                BusinessService.search({pageNumber: 0}).then(function (result) {
                    $scope.items = result.items;
                    _.each($scope.items, function (item) {
                        item.step1st = !!(item.name && item.streetAddress);
                        if (item.isVerificationFeePaid) {
                            item.step2nd = true;
                            item.step3rd = item.isVerified;
                        } else {
                            item.step2nd = false;
                            item.step3rd = false;
                        }
                    })
                }, function (reason) {
                    notify({ message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            }

            loadItems();
            /**
             * Verify business.
             */
            $scope.verifyBusiness = function () {
                $scope.modal = true;
                BusinessService.verifyByPlatformAdmin($scope.founder.id).then(function () {
                        loadItems();
                        $scope.modal = false;
                    }, function (reason) {
                        notify({ message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                    }
                );
            };

            /**
             * Show modal.
             * @param founder the founder entity.
             */
            $scope.showModal = function (founder) {
                $scope.modal = true;
                $scope.founder = founder;
            };
            /**
             * Hide modal.
             */
            $scope.closeModal = function () {
                $scope.modal = false;
            };

            /**
             * Show history popup.
             * @param id the business id.
             */
            $scope.showHistory = function (id) {
                $rootScope.$broadcast("showBusinessHistoryPopup", id);
            };

        }]);
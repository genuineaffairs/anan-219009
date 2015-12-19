/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for show business history popup.
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("showBusinessHistoryPopupCtrl", ['$scope', '$rootScope', '$location', 'BusinessService', "NotificationService", "GiftCardOfferService", 'storage', '$log', 'util', 'config', 'notify',
        function ($scope, $rootScope, $location, BusinessService, NotificationService, GiftCardOfferService, storage, $log, util, config, notify) {

            $scope.historyList = [];
            // close view details
            $scope.closeInfo = function () {
                $scope.hidePopup();
            };

            /**
             * Show popup.
             */
            $scope.showPopup = function () {
                $scope.display = true;
                $rootScope.details = true;
            };

            /**
             * Hide popup.
             */
            $scope.hidePopup = function () {
                $scope.display = false;
                $rootScope.details = false;
            };

            // add comment
            $scope.checkComment = function () {
                $scope.check = true;
            };

            $scope.$on("showBusinessHistoryPopup", function (e, businessId) {
                BusinessService.getAllBusinessActions({pageNumber: 0, businessId: businessId}).then(function (result) {
                    $scope.historyList = result.items;
                    $scope.showPopup();
                }, function () {
                    notify({message: 'Cannot get history', templateUrl: 'partials/module/notify-popup.html'});
                });

            });
        }]);

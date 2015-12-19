/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Business Account setup controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('businessAccountSetupCtrl', ['$scope', 'BusinessService',
        function ($scope, BusinessService) {
          $scope.showPayment = false;
          BusinessService.getMyBusiness().then(function (business) {
            $scope.business = business;
          }, function () {
            notify({message: "Cannot get business", templateUrl: 'partials/module/notify-popup.html'});
          });
          $scope.subscribe = function() {
            $scope.showPayment = true;
          };
        }
    ]);
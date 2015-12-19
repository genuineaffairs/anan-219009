/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for the my cart page
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.champion.myCart')
        .controller('MyCartCtrl', MyCartCtrl);

    MyCartCtrl.$inject = ['$scope', '$location', 'CartService', 'appConfig', 'pageData', 'GLOBAL_OPTIONS'];

    // My Cart page controller
    function MyCartCtrl($scope, $location, CartService, appConfig, pageData, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);

        $scope.myCart = CartService;
        $scope.offerDetails = pageData;
        var discount;

        if ($scope.offerDetails != null) {
            discount = parseFloat(100 - $scope.offerDetails.discount) / 100.0;
        }
        if($scope.myCart.totalValue && $scope.myCart.totalValue != null){
            updatePrice();
        }

        $scope.vm = {};

        $scope.vm.available = '$'+$scope.offerDetails.availableQuantity;
        $scope.vm.discount = $scope.offerDetails.discount + '%';

        $scope.vm.updatePrice = updatePrice;
        $scope.vm.paynow = paynow;
        $scope.vm.maxQuantity = Math.
            min(appConfig.MAX_QUANTITY, $scope.offerDetails.availableQuantity);

        //updates the price when user changes the value
        function updatePrice() {
             var price = $scope.myCart.totalValue * discount;
            $scope.myCart.price = Math.round(price * 100) / 100;
        }

        //Route change to payment screen
        function paynow() {
            $location.path('/payment');
        }
    }

})();

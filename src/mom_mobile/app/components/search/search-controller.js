/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definition for search bar in offers and my founder share pages.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$scope'];

    // Search controller
    function SearchCtrl($scope) {

        $scope.sort.orderBy = 'id';
        $scope.sort.orderRevers = false;

        $scope.sort.mode = 'order';
        $scope.sort.orders = [
            {
                "type": "name-asc",
                "title": "A-Z"
            },
            {
                "type": "name-desc",
                "title": "Z-A"
            },
            {
                "type": "amount",
                "title": "Amount"
            }
        ];

        //Set the order of cards based on use selection.
        $scope.sort.setOrder = function (order) {
            $scope.sort.orderBy = 'id';
            $scope.sort.orderRevers = false;
            $scope.sort.orderTitle = undefined;

            if (order) {
                $scope.sort.orderTitle = order.title;
                switch (order.type) {
                    case 'name-asc':
                        $scope.sort.orderBy = 'businessName';
                        break;
                    case 'name-desc':
                        $scope.sort.orderBy = 'businessName';
                        $scope.sort.orderRevers = true;
                        break;
                    case 'amount':
                        $scope.sort.orderBy = 'total';
                        $scope.sort.orderRevers = true;
                        break;
                }
            }
        };

        //Set the mode to order or search based on user selection
        $scope.sort.setMode = function (mode) {
            $scope.sort.mode = mode;
            $scope.search.businessName = '';
            if (mode === 'searching') {
                $scope.sort.orderBy = 'id';
                $scope.sort.orderRevers = false;
                $scope.sort.orderTitle = undefined;
                setTimeout(function () {
                    $('.search .input').focus();
                }, 0);
            } else if (mode === 'order') {
                $scope.sort.setOrder($scope.order);
            }
        };

        //If user click enter in the keyboard, perform search operation.
        $scope.search.checkEnter = function ($event) {
            if ($event.keyCode === 13 && typeof($scope.vm.doSearch) === 'function') {
                $scope.vm.doSearch();
            }
        };

        //If user clears the search, show all results
        $scope.search.clear = function () {
            $scope.search.businessName = '';
            if(typeof($scope.vm.doSearch) === 'function') {
                $scope.vm.doSearch();
            }
        };

        //If user cancels search, show all results and change the mode to order
        $scope.search.cancel = function () {
            $scope.sort.mode='order';
            $scope.search.businessName='';
            if (typeof($scope.vm.doSearch) === 'function' ) {
                $scope.vm.doSearch();
            }
        }

    }
})();
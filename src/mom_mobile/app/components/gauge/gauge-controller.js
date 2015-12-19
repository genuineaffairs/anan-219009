/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definition for gauge
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .controller('GaugeCtrl', GaugeCtrl);

    GaugeCtrl.$inject = ['$scope'];

    //gauge controller
    function GaugeCtrl($scope) {
        var fraction = parseFloat($scope.remain/$scope.total);

        if (fraction >= 1.0) {
            fraction = 0.99;
        }
        $scope.gauge = {
            x: 32 + 29 * Math.sin(2 * Math.PI * fraction),
            y: 32 - 29 * Math.cos(2 * Math.PI * fraction),
            largeFlag: fraction >= 0.5 ? 1 : 0
        };
    }
})();

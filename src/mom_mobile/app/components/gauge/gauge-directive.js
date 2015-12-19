/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents angular directives
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .directive('momGauge', momGauge);


    // gauge
    function momGauge () {
        return {
            restrict: 'A',
            templateUrl: 'assets/svg/gauge.svg',
            scope: {
                remain: '=remain',
                total: '=total',
                gstyle: '=gstyle'
            },
            controller: 'GaugeCtrl'
        }
    }
})();


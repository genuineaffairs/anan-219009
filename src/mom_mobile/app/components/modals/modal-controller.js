/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for modal controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .controller('ModalCtrl', ModalCtrl);

    ModalCtrl.$inject = ['$scope', '$modalInstance', 'text'];

    // Modal dialog controller
    function ModalCtrl($scope, $modalInstance, text) {
        $scope.text = text;
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.yes = function () {
            $modalInstance.close();
        };

        $scope.no = function () {
            $modalInstance.dismiss();
        };
    }
})();
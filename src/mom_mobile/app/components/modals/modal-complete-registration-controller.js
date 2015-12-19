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
        .controller('ModalCompleteSignUpCtrl', ModalCompleteSignUpCtrl);

    ModalCompleteSignUpCtrl.$inject = ['$scope', '$modalInstance'];

    // Modal dialog controller
    function ModalCompleteSignUpCtrl ($scope, $modalInstance) {

        $scope.submit = function () {
            if ($scope.form && $scope.form.$invalid) {
                return;
            }
            $modalInstance.close($scope.email);
        };

        $scope.no = function () {
            $modalInstance.dismiss();
        };
    }
})();
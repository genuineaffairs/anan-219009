/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for champion sign up page
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.common.signUp')
        .controller('SignUpChampionCtrl', SignUpChampionCtrl);

    SignUpChampionCtrl.$inject = ['$scope', '$location', '$rootScope', '$log', '$modal', 'SignUpService', 'GLOBAL_OPTIONS'];

    //sign Up Champion Controller
    function  SignUpChampionCtrl($scope, $location, $rootScope, $log, $modal, SignUpService, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);

        // reset modal
        SignUpService.signUpUtil($scope, $location, $rootScope, $log, $modal);

        $scope.register = $scope.validateUtil;
    }
})();
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for choose sign up page
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.common.signUp')
        .controller('SignUpChooseAccountCtrl', SignUpChooseAccountCtrl);


    SignUpChooseAccountCtrl.$inject = ['$scope', 'GLOBAL_OPTIONS'];


    //sign Up Champion Controller
        function SignUpChooseAccountCtrl  ($scope, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);
    }
})();
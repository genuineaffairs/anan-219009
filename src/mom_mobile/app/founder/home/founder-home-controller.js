/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for founder home page
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.founder.home')
        .controller('FounderHomeCtrl', FounderHomeCtrl);

    FounderHomeCtrl.$inject = ['$scope', '$location', 'GLOBAL_OPTIONS'];

    // Founder home controller
    function FounderHomeCtrl ($scope, $location, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);

	// start redeem process
	$scope.goRedeem = function() {
	    $location.path('/founder-redeem');
	};
    }
})();

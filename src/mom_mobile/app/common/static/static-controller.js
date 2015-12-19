/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for static pages like terms and privacy
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Added option to include page data and expose it to view model.
 *
 * Changes in 1.2
 *  - [PMP-182] Add editable static pages
 */

(function () {
    'use strict';

    angular
        .module('app.common.static')
        .controller('StaticCtrl', StaticCtrl);

    StaticCtrl.$inject = ['$scope', '$location', '$sce', 'StaticPageService', 'GLOBAL_OPTIONS', 'DATA'];

    // Controller for static pages like terms, privacy and faq
    function StaticCtrl ($scope, $location, $sce, StaticPageService, GLOBAL_OPTIONS, DATA) {
        $scope.resetGlobal(GLOBAL_OPTIONS);
        $scope.vm = {};
        $scope.vm.data = DATA;

	loadPage();

	/**
	 * Load static page content.
	 */
	function loadPage() {
	    var path = $location.path();
	    var name;
	    switch(path) {
	    case '/faq':
		name = 'faq';
		break;
	    case '/privacy':
		name = 'privacy';
		break;
	    case '/terms':
		name = 'terms';
		break;
	    default:
		return;
	    }
	    StaticPageService.getPageByName(name).then(function(page) {
		$scope.page = page;
		$scope.page.content = $sce.trustAsHtml(page.content);
	    });
	}
    }

})();

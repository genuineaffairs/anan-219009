/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Static pages controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('staticPagesCtrl', ['$scope', '$location', '$sce', 'StaticPageService', 'notify', function ($scope, $location, $sce, StaticPageService, notify) {
	$scope.page = {
	    name: '',
	    content: ''
	};

	loadPage();

	/**
	 * Load the page content.
	 */
	function loadPage() {
	    var path = $location.path();
	    var name;
	    switch(path) {
	    case '/Faq':
		name = 'faq';
		break;
	    case '/PrivacyPolicy':
		name = 'privacy';
		break;
	    case '/TermsAndConditions':
		name = 'terms';
		break;
	    case '/Copyright':
		name = 'copyright';
		break;
	    default:
		notify({message: "The page you requested does not exist.", templateUrl: 'partials/module/notify-popup.html'});
		$location.path('/home');
		return;
	    }
	    StaticPageService.getPageByName(name).then(function(page) {
		$scope.page = page;
		$scope.page.content = $sce.trustAsHtml(page.content);
	    }, function(reason) {
		notify({message: "The page could not be loaded: "+reason.error, templateUrl: 'partials/module/notify-popup.html'});
	    });
	}
	
    }]);

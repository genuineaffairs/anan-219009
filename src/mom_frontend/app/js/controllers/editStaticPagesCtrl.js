/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Edit static pages controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .directive('ckEditor', ['config', 'storage', function (config, storage) {
	return {
            require: '?ngModel',
            link: function ($scope, elm, attr, ngModel) {
		var ck = CKEDITOR.replace(elm[0], {
		    extraPlugins: 'uploadimage',
		    uploadUrl: config.REST_SERVICE_BASE_URL + '/fileUpload?'
		});

		ck.on('fileUploadRequest', function( evt ) {
		    var xhr = evt.data.fileLoader.xhr;
		    var accessToken = storage.getSessionToken();

		    xhr.setRequestHeader('Cache-Control', 'no-cache');
		    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
		    var form = new FormData();
		    form.append("upload", evt.data.fileLoader.file, evt.data.fileLoader.fileName);
		    xhr.send(form);

		    // Prevented default behavior.
		    evt.stop();
		} );

		ck.on('pasteState', function () {
                    $scope.$apply(function () {
			ngModel.$setViewValue(ck.getData());
                    });
		});

		ngModel.$render = function (value) {
                    ck.setData(ngModel.$modelValue);
		};
            }
	};
    }])
    .controller('editStaticPagesCtrl', ['$scope', '$location', 'StaticPageService', 'notify', 'util', function ($scope, $location, StaticPageService, notify, util) {
	if (!util.getUserRoles(util.PLATFORM_EMPLOYEE)) {
	    $location.path('/Home');
	    return;
	}

	$scope.pages = {
	    availablePages: [],
	    activePage: null
	};

	$scope.password = '';
	$scope.modal = false;

	$scope.reset = loadPages;
	$scope.save = save;
	$scope.confirmPassword = confirmPassword;
	$scope.closeModal = closeModal;

	loadPages();

	/**
	 * Set available pages and make the first one active.
	 * @param {[Page]} pages the pages
	 */
	function setPages(pages) {
	    $scope.pages.availablePages = pages;
	    $scope.pages.activePage = $scope.pages.availablePages[0];
	}

	/**
	 * Load pages.
	 */
	function loadPages() {
	    StaticPageService.getAllPages().then(function(pages) {
		setPages(pages);
	    }, function(reason) {
		notify({message: "The pages could not be loaded: "+reason.error, templateUrl: 'partials/module/notify-popup.html'});
	    });
	}

	/**
	 * Begin save process for active page. This opens the save
	 * modal to ask for password confirmation.
	 */
	function save() {
	    $scope.modal = true;
	}

	/**
	 * Close the modal.
	 */
	function closeModal() {
	    $scope.password = '';
	    $scope.modal = false;
	}

	/**
	 * Save the active page and close the modal.
	 */
	function confirmPassword() {
	    StaticPageService.savePage($scope.pages.activePage, $scope.password).then(function(result) {
		notify({message: "Your modifications have been saved successfully.", templateUrl: 'partials/module/notify-popup.html'});
	    }, function(reason) {
		notify({message: "Your modifications could not be saved: "+reason.error, templateUrl: 'partials/module/notify-popup.html'});
	    });
	    closeModal();
	}
    }]);

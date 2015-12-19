/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for champion and admin history pages
 *
 * Changes in verion 1.1
 * - Add sorting while fetching history
 *
 * Changes in version 1.2 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-225] Update History design
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.common.history')
        .controller('HistoryCtrl', HistoryCtrl);

    HistoryCtrl.$inject = ['$scope', 'UserService', 'BusinessService', 'ModalService', 'pageData', 'GLOBAL_OPTIONS', 'pageRole', 'appConfig'];

    //History page controller
    function HistoryCtrl($scope, UserService, BusinessService, ModalService, pageData, GLOBAL_OPTIONS, pageRole, appConfig) {
        $scope.resetGlobal(GLOBAL_OPTIONS);
        $scope.vm = {};
        $scope.vm.role = pageRole;
        $scope.vm.historyList = [];
        $scope.vm.historyList = pageData.items;
        $scope.vm.loadMore = loadMore;
	$scope.vm.targetLink = targetLink;


        $scope.vm.currentPage = appConfig.HISTORY_HOME_PAGES + 1;
        $scope.vm.totalRecords = pageData.totalRecords;
        $scope.vm.loadRecords = appConfig.HISTORY_ITEMS_PER_PAGE;

	// Get the icon url for a transaction type
	$scope.getHistoryTypeIcon = function(type) {
	    var basePath = "assets/i/"
	    switch (type) {
	    case "GIFT_ACCEPTED":
		return basePath + "gift_received.png";
	    case "GIFTED":
		return basePath + "gift_sent.png";
	    case "PURCHASE":
		return basePath + "purchase.png";
	    case "REDEMPTION":
		return basePath + "redemption.png";
	    }
	}

        return;

	// Create a url for the target link
	function targetLink(target) {
	    if (/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(target)) {
		return 'mailto:' + target;
	    } else if (/^@.*/.test(target)) {
		return 'https://twitter.com/' + target;
	    } else {
		return 'tel:' + target;
	    }
	}
	
        //load next page data when user scrolls to the bottom.
        function loadMore() {
            if ($scope.vm.historyList && $scope.vm.historyList.length < $scope.vm.totalRecords && !$scope.vm.pause) {
                $scope.vm.pause = true;

                var params = {
                    pageNumber: $scope.vm.currentPage,
                    pageSize: appConfig.HISTORY_ITEMS_PER_PAGE,
                    sortOrder: 'Descending',
                    sortBy: 'timestamp'
                };

                var promise;
                if (pageRole == 'champion') {
                    promise = UserService.getMyActions(params);
                } else {
                    promise = BusinessService.getMyBusinessActions(params);
                }

                promise
                    .then(function (response) {
                        for (var i = 0; i < response.items.length; i++) {
                            $scope.vm.historyList.push(response.items[i]);
                        }
                        $scope.vm.currentPage += 1;
                        $scope.vm.pause = false;
                    }, function () {
                        ModalService.showModal('id012', 'alert');
                        $scope.vm.pause = false;
                    });

            }
        }


    }

})();

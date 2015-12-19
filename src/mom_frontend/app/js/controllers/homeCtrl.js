/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Home Controller
 * Changes in version 1.1:
 *  - Added the addToCard() method.
 *
 * Changes in version 1.2:
 *  - Added the load more item count configuration item.
 *
 * Changes in version 1.3:
 * - Move deviceDetector check to app.js
 *
 * Changes in version 1.4:
 * - Cached url for login redirect.
 *
 * Changes in version 1.5:
 * - Add new title
 *
 * Changes in version 1.6: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Implement location search box and business type dropdown
 *
 * Changes in version 1.7 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-229] Show alternative results if there are no search results
 * 
 * @version 1.7
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('homeCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'GiftCardOfferService', '$timeout', "storage", "config",
	function ($scope, $rootScope, $routeParams, $location, GiftCardOfferService, $timeout, storage, config) {
            $scope.loadMoreItemCount = config.LOAD_MORE_ITEM_COUNT;
            $scope.extraSearchTextBoxes = true;
	    $scope.showAlternativeOffers = false;
            var search = $scope.search;
            $scope.pause = false;
            $scope.check = false;
            $scope.Home = {};
            var GiftCardOfferPromise = GiftCardOfferService.getAllGiftCardOffers;
            var currentPageNum;

	    // Clear search results
	    $scope.clearSearch = function() {
		$location.hash('');
		$location.path('/');
	    };

	    //load alternative results
	    function loadAlternative() {
		GiftCardOfferPromise({
                    pageNumber: 1,
                    pageSize: 3,
                    businessName: undefined,
                    businessType: undefined,
                    lat: search.lat,
                    long: search.long,
		    sortByDiscount:true,
                    status: "ACTIVE"
                }).then(function (data) {
                    $scope.showAlternativeOffers = true;
		    //prevent loading more results
		    $scope.totalRecords = data.items.length;
                    $scope.giftCardOffers = data.items;
                    $scope.Home.title = "Nothing came up for that search, but here are a few local businesses that might interest you.";
                });
	    }
	    
            //load initial offers
            function init() {
		$scope.showAlternativeOffers = false;
		currentPageNum = 4;
                GiftCardOfferPromise({
                    pageNumber: 1,
                    pageSize: 12,
                    businessName: search.name || undefined,
                    businessType: search.type.id || undefined,
                    lat: search.lat,
                    long: search.long,
                    status: "ACTIVE"
                }).then(function (data) {
                    $scope.totalRecords = data.totalRecords;
		    //if we get no results, load alternative offers
		    if ($scope.totalRecords === 0) {
			return loadAlternative();
		    }
                    $scope.giftCardOffers = data.items;
                    if (window.location.hash.indexOf('search') !== -1) {
                        $scope.Home.title = 'Search Results';
                        $scope.Home.subtitle = '';
                    } else {
                        $scope.Home.title = 'Rediscover Local Business';
                        $scope.Home.subtitle = 'Join the movement. Click a tile, buy a Founder$hare gift card for yourself or a friend and help revitalize Main Street!';
                    }
                });
            }
            init();

            $scope.$on("reload-offers", function () {
                init();
            });

            // infinite scroll
            $scope.loadMore = function () {

                if ($scope.giftCardOffers && $scope.giftCardOffers.length < $scope.totalRecords && !$scope.pause) {
                    $scope.pause = true;
                    $timeout(function () {
                        GiftCardOfferPromise({
                            pageNumber: currentPageNum,
                            pageSize: $scope.loadMoreItemCount,
                            businessName: search.name || undefined,
                            businessType: search.type.id || undefined,
                            lat: search.lat,
                            long: search.long,
                            status: "ACTIVE"
                        }).then(function (data) {
                            for (var i = 0; i < data.items.length; i++) {
                                $scope.giftCardOffers.push(data.items[i]);
                            }
                        }, function (data) {
                        });

                        currentPageNum += 1;
                        $scope.pause = false;
                    }, 800);
                }
            };

            $scope.showInfo = function (offer) {
                if (!$rootScope.tmp) {
                    $rootScope.tmp = {};
                }
                $rootScope.tmp.offerId = offer.id;
                $rootScope.$broadcast("showOfferPopup", offer.id);
            };
            // Show giftCardOffer Detail if router params contains offerId
            if ($routeParams.offerId && $routeParams.offerId.length > 0) {
                $rootScope.$broadcast("showOfferPopup", $routeParams.offerId);
            }
        }
    ]);

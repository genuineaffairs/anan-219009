/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and controller definitions for offers page
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Implement search by type and location
 *
 * Changes in version 1.2 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-229] Empty search result
 */

(function () {
    'use strict';

    angular
        .module('app.common.offers')
        .controller('OffersCtrl', OffersCtrl);

    OffersCtrl.$inject = ['$scope', '$location', 'GiftCardOfferService', 'ModalService', 'appConfig', 'offers', 'businessTypes', 'GLOBAL_OPTIONS', '$log'];

    
    // Offers controller
    function  OffersCtrl($scope, $location, GiftCardOfferService, ModalService, appConfig, offersData, businessTypes, GLOBAL_OPTIONS, $log) {
        var defaultAddress;
        var offers = offersData.result;
        var searchCriteria = offersData.criteria;
        var userLocation = {
            latitude: searchCriteria.lat,
            longitude: searchCriteria.long
        };
        $scope.resetGlobal(GLOBAL_OPTIONS);
        $scope.search = {};
        $scope.sort = {};
        $scope.vm = {};

        $scope.vm.toggleState = toggleState;
        $scope.vm.showDetails = showDetails;
        $scope.vm.doSearch = doSearch;
        $scope.vm.loadMore = loadMore;
        $scope.vm.typeChanged = typeChanged;
        $scope.vm.showSearch = showSearch;
        $scope.vm.clearAddress = clearAddress;
        $scope.vm.clearSearch = clearSearch;
        $scope.vm.cancelSearch = cancelSearch;

        $scope.vm.currentPage = appConfig.OFFERS_HOME_PAGES + 1;
        $scope.vm.totalRecords = offers.totalRecords;
        $scope.vm.currentRecords = 0;
        $scope.vm.loadRecords = appConfig.OFFERS_PER_PAGE;
        $scope.vm.pause = false;
	$scope.vm.showAlternativeOffers = false;


        businessTypes.unshift({
            name: "Any Type"
        });
        // store search data
        $scope.vm.search = {
            lat: userLocation.latitude,
            long: userLocation.longitude,
            type: businessTypes[0],
            allTypes: businessTypes
        };

        init();
        getDefaultAddress();
        initLocationAutoComplete();

        return;

        //format and load the data used in the page
        function init() {
            $scope.giftCardOffers = offers.items;
            $scope.vm.currentRecords += offers.items.length;

            for (var i = $scope.giftCardOffers.length - 1; i >= 0; i--) {
                var giftCardOffer = $scope.giftCardOffers[i];
                giftCardOffer.total = giftCardOffer.availableQuantity;
            }

            $scope.giftCardOffers = _.filter($scope.giftCardOffers, function (offer) {
                return offer.total;
            });
            $scope.vm.totalRecords = offers.totalRecords;
        }

        //change type in dropdown
        function typeChanged(type) {
            $scope.vm.search.type = type;
            $scope.vm.search.name = undefined;
            doSearch();
        }
        
        //show search and location textboxes
        function showSearch() {
            $scope.vm.isShowSearch = true;
        }
        
        //create autocomplete for location textbox
        function initLocationAutoComplete()  {
            //initialize google location autocomplete
            var locationInterval = setInterval(function () {
                var textbox = document.getElementById("searchLocation");
                if (!textbox) {
                    return;
                }
                clearInterval(locationInterval);
                var searchBox = new google.maps.places.SearchBox(textbox);

                searchBox.addListener('places_changed', function() {
                    var place = searchBox.getPlaces()[0];
                    $scope.vm.search.name = undefined;
                    if (place) {
                        $scope.vm.search.lat = place.geometry.location.G;
                        $scope.vm.search.long = place.geometry.location.K;
                        doSearch();
                        $scope.$apply();
                    } else {
                        $scope.vm.search.lat = undefined;
                        $scope.vm.search.long = undefined;
                    }
                });
            }, 100);
        }
        
        //clear address input
        function clearAddress() {
            $scope.vm.search.address = '';
            $scope.vm.search.lat = undefined;
            $scope.vm.search.long = undefined;
        }
        
        //clear search textbox and update results
        function clearSearch() {
            $scope.vm.search.name = '';
            doSearch();
        }
        
        //cancel search form
        function cancelSearch() {
            $scope.vm.search.name = '';
            $scope.vm.search.address = defaultAddress;
            $scope.vm.search.lat = userLocation.latitude;
            $scope.vm.search.long = userLocation.longitude;
            $scope.vm.isShowSearch = false;
            doSearch();
        }
        
        //get default address based on current coordinates
        function getDefaultAddress() {
            if (defaultAddress) {
                $scope.vm.search.address = defaultAddress;
                return;
            }
            //get address based on location
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'location': {
                    lat: userLocation.latitude,
                    lng: userLocation.longitude
                }
            }, function (results, status) {
                if (status !== "OK") {
                    $log.error("Cannot get location");
                    $log.error(arguments);
                } else {
                    var result = results[0];
                    if (result) {
                        var city = "";
                        var state = "";
                        _.each(result.address_components, function (item) {
                            if (item.types[0] === "locality") {
                                city = item.long_name;
                            }
                            if (item.types[0] === "administrative_area_level_1") {
                                state = item.short_name;
                            }
                        });
                        defaultAddress = $scope.vm.search.address = city + ", " + state;
                        $scope.$apply();
                    }
                }
            });
        }
        
        //change the toggle state of the business to show/hide their offers
        function toggleState(element) {
            if (element.isOpen) {
                element.isOpen = false;
            } else {
                element.isOpen = true;
            }
        }

        //when user clicks on details of a particular offer,
        function showDetails(offerId) {
            $location.path('/offer-details/'+offerId);
        }

	//load alternative results
	function loadAlternative() {
	    var search = $scope.vm.search;
            if (!search.lat || !search.long) {
                return;
            }
	    GiftCardOfferService.search({
                pageNumber: 1,
                pageSize: 3,
                businessName: undefined,
                businessType: undefined,
                lat: search.lat,
                long: search.long,
		sortByDiscount:true,
                status: "ACTIVE"
            }).then(function (response) {
                $scope.vm.showAlternativeOffers = true;
		offers = response;
		init();
		//prevent loading more results
		$scope.vm.totalRecords = response.items.length;
            });
	}
	
        //refresh the page data based on the search term
        function doSearch () {
	    $scope.vm.showAlternativeOffers = false;
            var search = $scope.vm.search;
            if (!search.lat || !search.long) {
                return;
            }
            $scope.vm.currentPage = 1;
            searchCriteria = {
                pageNumber: 1,
                pageSize: appConfig.OFFERS_PER_PAGE,
                status: 'ACTIVE',
                businessName: search.name || undefined,
                businessType: search.type.id || undefined,
                lat: search.lat,
                long: search.long
            };
            GiftCardOfferService
                .search(searchCriteria)
                .then(function (response){
                    offers = response;
		    if (!offers.items.length) {
			return loadAlternative();
		    }
                    init();
                }, function(){
                    ModalService.showModal('id012', 'alert');
                });
        }

        //load next page two pages of data when user scrolls to the bottom.
        function loadMore() {
            if($scope.giftCardOffers && $scope.giftCardOffers.length <$scope.vm.totalRecords && !$scope.vm.pause) {
                $scope.vm.pause = true;
                searchCriteria.pageNumber++;
                GiftCardOfferService.search(searchCriteria)
                    .then(function (response) {
                        $scope.vm.currentRecords += response.items.length;
                        for (var i = 0; i < response.items.length; i++) {
                            var giftCardOffer = response.items[i];
                            giftCardOffer.total = giftCardOffer.availableQuantity;
                            if (giftCardOffer.total > 0) {
                                $scope.giftCardOffers.push(giftCardOffer);
                            }
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

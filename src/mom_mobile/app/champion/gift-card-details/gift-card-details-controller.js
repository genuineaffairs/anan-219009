/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for the gift card details page
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1
 *  - Changed name from details controller to gift card details controller
 *  - Included calculation of driving duration to the business
 * Changes in version 1.2: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Don't load google map script
 * Changes in version 1.3 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-158] Load giftCardOffer data
 */

(function () {
    'use strict';

    angular
        .module('app.champion.giftCardDetails')
        .controller('GiftCardDetailsCtrl', GiftCardDetailsCtrl);

    GiftCardDetailsCtrl.$inject = ['$scope', '$location', 'UtilService', 'pageData', 'GLOBAL_OPTIONS'];

    // Gift card details page controller
    function GiftCardDetailsCtrl($scope, $location, UtilService, pageData, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);
        $scope.vm = {};

        $scope.vm.showLocation = false;
        $scope.vm.duration = null;

        $scope.giftCard = pageData.giftCard;
	$scope.giftCardOffer = pageData.giftCardOffer;
        $scope.business = pageData.business;

        if ($scope.business.businessHours) {
            $scope.vm.businessHours = $scope.business.businessHours;
        } else {
            $scope.vm.businessHours = '00:00 - 00:00';
        }

        loadMap();
        getLocation();
        return;


        //Renders the map and set the marker at the business
        function loadMap() {
            var lat = 0,
                lng = 0;

            if ($scope.business && $scope.business.coordinates) {
                lat = $scope.business.coordinates[1];
                lng = $scope.business.coordinates[0];
            }

            var mapPosition = new google.maps.LatLng(lat, lng);
            var mapCanvas = $('.map-canvas').get(0);
            var mapOptions = {
                center: mapPosition,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(mapCanvas, mapOptions);
            var marker = new google.maps.Marker({
                position: mapPosition,
                icon: 'assets/i/marker.png',
                map: map
            });
        }

        //Get the current user location and calculate driving distance to the business
        function getLocation() {
            UtilService
                .getLocation()
                .then(function (coords){
                    $scope.vm.source = {};
                    $scope.vm.source.lat = coords.latitude;
                    $scope.vm.source.long =  coords.longitude;
                    var currLocation = new google.maps.LatLng(coords.latitude, coords.longitude),
                        businessLocation = new google.maps.LatLng(
                            $scope.business.coordinates[0], $scope.business.coordinates[1]);
                    var distanceMatrixService = new google.maps.DistanceMatrixService();
                    distanceMatrixService.getDistanceMatrix(
                        {
                            origins: [currLocation],
                            destinations: [businessLocation],
                            travelMode: google.maps.TravelMode.DRIVING,
                            unitSystem: google.maps.UnitSystem.IMPERIAL
                        },
                        function(response, status) {
                            if(status === google.maps.DistanceMatrixStatus.OK) {
                                if (response.originAddresses.length
                                    && response.destinationAddresses.length
                                    && response.rows[0].elements[0].status == google.maps.DistanceMatrixStatus.OK ) {
                                    $scope.vm.duration = response.rows[0].elements[0].duration.text;
                                    var pageUrl = $location.absUrl().split('#')[0];
                                    pageUrl += '#/show-route/?';
                                    pageUrl += 'sLat=' + $scope.vm.source.lat;
                                    pageUrl += '&sLng=' + $scope.vm.source.long;
                                    pageUrl += '&dLat=' + $scope.business.coordinates[0];
                                    pageUrl += '&dLng=' + $scope.business.coordinates[1];
                                    $scope.vm.url = pageUrl;
                                    $scope.vm.showLocation = true;
                                    $scope.$apply();
                                }
                            }
                        }
                    )
                })
        }
    }

})();







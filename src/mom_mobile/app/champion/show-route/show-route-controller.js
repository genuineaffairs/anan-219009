/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for the show route page
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.champion.showRoute')
        .controller('ShowRouteCtrl', ShowRouteCtrl);

    ShowRouteCtrl.$inject = ['$scope', '$rootScope', '$location', 'ModalService', 'GLOBAL_OPTIONS', 'deviceDetector'];

    // Show route page controller
    function ShowRouteCtrl($scope, $rootScope, $location, ModalService, GLOBAL_OPTIONS, deviceDetector) {
        $scope.resetGlobal(GLOBAL_OPTIONS);
        $scope.vm = {};
        var params = $location.search();
        if ( !params.hasOwnProperty('sLat') || !params.hasOwnProperty('sLng')
            || !params.hasOwnProperty('dLat') || !params.hasOwnProperty('dLng') ) {
            ModalService.showModal('id023', 'alert');
            return;
        }
        var sLat = params['sLat'],
            sLng = params['sLng'],
            dLat = params['dLat'],
            dLng = params['dLng'];

        if(deviceDetector.os == 'ios'){
            $rootScope.startUrl = 'maps://maps.apple.com?saddr=Current Location&daddr='+dLat+','+dLng;


        } else if(deviceDetector.os == 'android') {
            $rootScope.startUrl = 'google.navigation:q='+dLat+','+dLng;
        } else if(deviceDetector.os == 'windows-phone') {
            $rootScope.startUrl = 'bingmaps:?rtp=pos.'+sLat+'_'+sLng+'~pos.'+dLat+'_'+dLng;
        }

        initMaps();

        return;

        //Include google maps script if it is not included yet and call load maps function
        function initMaps() {
            // Check google maps api already loaded
            if ($('#google-maps-script').length) {
                loadMap();
                return;
            }

            // Map api load callback
            window.initializeGoogleMaps = function () {
                delete window.initializeGoogleMaps;
                loadMap();
            };

            // Load google maps api
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = 'google-maps-script';
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initializeGoogleMaps';
            document.body.appendChild(script);
        }

        //Calculate the route from user location to business and render route map
        function loadMap() {

            var directionsService = new google.maps.DirectionsService(),
                directionsDisplay = new google.maps.DirectionsRenderer(),
                source = new google.maps.LatLng(sLat, sLng),
                destination = new google.maps.LatLng(dLat, dLng),
                mapOptions = {
                    center: source,
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                },
                mapCanvas = $('.map-canvas').get(0),
                map = new google.maps.Map(mapCanvas, mapOptions),
                request = {
                    origin: source,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                };

            directionsDisplay.setMap(map);
            directionsService
                .route(
                    request,
                    function(result, status){
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(result);
                        } else {
                            ModalService.showModal('id023', 'alert');
                            $scope.$apply();
                        }
                })
        }

    }

})();







/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Main Controller
 *
 * Changes in version 1.1:
 *  - Removed the addToCard() method.
 *
 * Changes in version 1.2:
 *  - Added login() method.
 *
 * Changes in version 1.3: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Implement location search box and business type dropdown
 *
 * Changes in version 1.4 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-159] Add Breadcrumbs
 * - [PMP-252] Check if business payment method is verified
 *
 * Changes in 1.5 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - Refactored code to improve readablity
 * - [PMP-237] Added switchRole logic
 * @version 1.5
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("mainCtrl", ['$scope', '$rootScope', 'DataService', 'LookupService', 'BusinessService',
        '$location', 'util', '$log', 'crumble', 'UserService', 'notify',
        function ($scope, $rootScope, DataService, LookupService, BusinessService,
                  $location, util, $log, crumble, UserService, notify) {
            $rootScope.modal = false;
            // store search data
            $rootScope.keyword = '';
            $scope.util = util;
            $scope.crumble = crumble;
            $scope.showBreadcrumbs = true;
            $scope.socialNetworks = {
                facebook: 'FACEBOOK',
                twitter: 'TWITTER',
                linkedin: 'LINKEDIN'
            };
            $scope.facebookLoginResponse = {
                connected: 'connected',
                not_authorized: 'not_authorized',
                unknown: 'unknown'
            };
            // store search data
            $scope.search = {
                lat: window.USER_LOCATION.latitude,
                long: window.USER_LOCATION.longitude,
                type: {
                    name: "Any Type"
                },
                allTypes: [{
                    name: "Any Type"
                }]
            };

            $scope.isActivePage = isActivePage;
            $scope.typeChanged = typeChanged;
            $scope.doSearch = doSearch;
            $scope.logout = util.logout;
            $scope.goUser = goUser;
            $scope.login = login;
            $scope.searchCards = searchCards;
            $scope.getGauge = getGauge;
            $scope.role = {
                switch: switchRole,
                hasDualRoles: function () { return $rootScope.loggedUser && $rootScope.loggedUser.userRoles.length > 1 },
                nextRole: nextRole,
                doSwitch: doSwitch,
                roleMap: {
                    'Champion': util.INDIVIDUAL_USER,
                    'Business Admin': util.BUSINESS_ADMIN
                }
            };

            // mock up add to card
            var defaultAddress, locationInterval;

            activate ();

            ////////////////////////////////////////////////

            function activate () {
                //get and add other business types in background
                LookupService.getAllBusinessTypes().then(function (types) {
                    $scope.search.allTypes.push.apply($scope.search.allTypes, types);
                });
                _getLocationAddress();
                //if we allow location after page load, reload current results
                if (navigator.geolocation && !window.USER_LOCATION.isReal) {
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        window.USER_LOCATION = pos.coords;
                        window.USER_LOCATION.isReal = true;
                        _getLocationAddress();
                        $scope.search.lat = window.USER_LOCATION.latitude;
                        $scope.search.long = window.USER_LOCATION.longitude;
                        $rootScope.$broadcast("reload-offers");
                        $rootScope.$apply();
                    });
                }
                //initialize google location autocomplete
                locationInterval = setInterval(function () {
                    var textbox = document.getElementById("searchLocation");
                    if (!textbox) {
                        return;
                    }
                    clearInterval(locationInterval);
                    var searchBox = new google.maps.places.SearchBox(textbox);

                    searchBox.addListener('places_changed', function() {
                        var place = searchBox.getPlaces()[0];
                        $scope.search.name = undefined;
                        if (place) {
                            $scope.search.lat = place.geometry.location.G;
                            $scope.search.long = place.geometry.location.K;
                            $scope.doSearch();
                            $scope.$apply();
                        } else {
                            $scope.search.lat = null;
                            $scope.search.long = null;
                        }
                    });
                }, 100);
                // Reset search field when user leaves search page
                $rootScope.$on('$locationChangeStart', function (ev, newUrl, oldUrl) {
                    if (oldUrl && oldUrl.match(/#search/) && !newUrl.match(/#search/)) {
                        $scope.search.type = {name: "Any Type"};
                        $scope.search.name = undefined;
                        $scope.search.lat = window.USER_LOCATION.latitude;
                        $scope.search.long = window.USER_LOCATION.longitude;
                        $scope.search.address = defaultAddress;
                    }
                });
                // Update crumble breadcrumbs
                $rootScope.$on('$locationChangeSuccess', function(ev, newUrl) {
                    crumble.update();
                    // Don't show breadcrumbs on home page
                    $scope.showBreadcrumbs = (newUrl !== '#/' && newUrl !== '#/Home');
                });

                var StaticURLsPromise = DataService.query('StaticPageUrl');
                StaticURLsPromise.then(function (data) {
                    $scope.staticUrls = data.urls;
                }, function (data) {
                });

                util.setRolesToRootScope();

                //if user is a founder, check if the business is setup
                if ($rootScope.isFounder) {
                    BusinessService.getMyBusiness().then(function (business) {
                        $rootScope.isVerificationFeePaid = business.isVerificationFeePaid;
                    });
                }

                $rootScope.header = {};
            }
            /**
             * Check if given path is current location
             * @param path the url path
             * @returns {boolean} true if given path is active
             */
            function isActivePage (path) {
                return $location.path() === path;
            }
            //get address based on location
            function _getLocationAddress() {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    'location': {
                        lat: window.USER_LOCATION.latitude,
                        lng: window.USER_LOCATION.longitude
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
                            defaultAddress = $scope.search.address = city + ", " + state;
                            $scope.$apply();
                        }
                    }
                });
            }
            // Business type has changed
            function typeChanged () {
                $scope.search.name = undefined;
                $scope.doSearch();
            }

            // Redirect to search page
            function doSearch () {
                if (!$scope.search.lat || !$scope.search.long) {
                    return;
                }
                $location.path('/Home');
                $location.hash('search');
            }
            //go to my profile
            function goUser () {
                $location.url($rootScope.getHome());
            }

            /**
             * Login.
             */
            function login () {
                if ($rootScope.tmp) {
                    delete $rootScope.tmp;
                }
                $location.url('/Login');
            };

            function searchCards () {
                // redirect to home page home page will perform search based on the keyword in rootscope
                $location.path('/');
            };

            function getGauge (item, color, radius) {
                var percent = item ? (item.availableQuantity / item.totalQuantity) : 1;

                if (percent >= 1) {
                    percent = 0.99;
                }
                radius = radius || 32;

                return {
                    r: radius,
                    r2: radius * 2,
                    ri: radius - 3,
                    x: radius + (radius - 3) * Math.sin(2 * Math.PI * percent),
                    y: radius - (radius - 3) * Math.cos(2 * Math.PI * percent),
                    largeFlag: percent >= 0.5 ? 1 : 0,
                    nonce: Math.random().toString(),
                    color: color || '#257149'
                };
            };

            function switchRole () {
                $scope.notify = {isConfirmation: true, ok: $scope.role.doSwitch};
                notify({message: "You will be logged out and log back in with '"+ nextRole() +"' role. " +
                "Do you like to proceed ?",
                    templateUrl: 'partials/module/notify-popup.html',
                    scope: $scope
                });
            }
            function doSwitch () {
                UserService.switchRole($scope.role.roleMap[nextRole()]).then(function() {
                    util.refreshUser(function (err) {
                        if(err) {
                            notify({message: "Error occurred while switching role. Try again later.",
                                templateUrl: 'partials/module/notify-popup.html'});
                            return;
                        }
                        if ($rootScope.isFounder) {
                            $location.path('/FounderStatus');
                        } else {
                            $location.path('/Founder$hares');
                        }
                        notify.closeAll();
                    });

                });
            }
            function nextRole () {
                if($rootScope.loggedUser && $rootScope.loggedUser.loggedInAs) {
                    return $rootScope.loggedUser.loggedInAs === util.INDIVIDUAL_USER ? 'Business Admin' : 'Champion';
                } else {
                    return 'Champion'
                }
            }
        }
    ]);

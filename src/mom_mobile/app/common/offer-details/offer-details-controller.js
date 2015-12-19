/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for the gift offer details page
 *
 * @version 1.5
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1:
 * - PMP-178: Temporarily disable Shopping Cart and replace by Buy Now
 *
 * Changes in version 1.2: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Don't load google maps script
 *
 * Changes in version 1.3 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-215] Fix days remaining
 *
 * Changes in version 1.4 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-223] Add slider
 * - Set map zoom factor to 16
 *
 * Changes in version 1.5 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Refactored the code to make checking roles consistent.
 */

(function () {
    'use strict';

    angular
        .module('app.common.offerDetails')
        .controller('OfferDetailsCtrl', OfferDetailsCtrl);

    OfferDetailsCtrl.$inject = ['$rootScope', '$scope', '$routeParams', '$location', 'UtilService', 'GiftCardOfferService',
				'CartService', 'ModalService', 'pageData', 'appConfig', 'GLOBAL_OPTIONS'];

    // offer details page controller
    function OfferDetailsCtrl($rootScope, $scope, $routeParams, $location, UtilService, GiftCardOfferService,
                              CartService, ModalService, pageData, appConfig, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);

        $scope.vm = {};
        $scope.ms = ModalService;

        $scope.offerDetails = pageData.offerDetails;
        $scope.business = pageData.businessDetails;
        $scope.offerDetails.comments = pageData.comments;

	// put conditions into an array
	$scope.conditions = [];
	_.each(pageData.offerDetails.platformConditions.split('\n'), function(c) {
	    $scope.conditions.push(c);
	});
	if (pageData.offerDetails.conditions &&
	    pageData.offerDetails.conditions.trim().length) {
	    $scope.conditions.push(pageData.offerDetails.conditions);
	}

	/* BEGIN TEMPORARY: PMP-178 */
	var initialValue = appConfig.DEFAULT_BUY_NOW_VALUE;
	if (isNaN(initialValue) || Number($scope.offerDetails.availableQuantity) < initialValue) {
	    initialValue = Number($scope.offerDetails.availableQuantity);
	}
	$scope.buyNowDetails = {
	    value: initialValue,
	    min: appConfig.MIN_BUY_NOW_VALUE || 0,
	    invalid: false
	};
	/* Only show Buy now to users */
	if (!UtilService.isLoggedIn() || $rootScope.isUser) {
	    $scope.vm.showBuyNow = true;
	} else {
	    $scope.vm.showBuyNow = false;
	}
	/* END TEMPORARY: PMP-178 */

        $scope.vm.daysRemaining = Math.floor((new Date($scope.offerDetails.expirationDate).getTime() - new Date().getTime()) / (24 * 3600 * 1000));
	if ($scope.vm.daysRemaining < 0) {
	    $scope.vm.daysRemaining = 'expired';
	}

        if ($scope.business.businessHours) {
            $scope.vm.businessHours = $scope.business.businessHours;
        } else {
            $scope.vm.businessHours = '00:00 - 00:00';
        }

	$scope.ms.offerDetails = $scope.offerDetails;

        $scope.vm.submitComment = submitComment;

	/* BEGIN TEMPORARY: PMP-178 */
	/*
        $scope.vm.addToCart = addToCart;
	*/

	$scope.vm.buyNow = buyNow;
	$scope.vm.checkBuyNowValue = checkBuyNowValue;
	/* END TEMPORARY: PMP-178 */

        $scope.vm.gaugestyle = {
            bgcolor: "#e0e0e0"
        };

        $scope.vm.commentsClosed = false;
        if ($scope.offerDetails.comments.length === 0) {
            $scope.vm.commentsClosed = true;
        }

        loadMap();

	/* BEGIN TEMPORARY: PMP-178 */
	/*
        if ($rootScope.tmp.cartOfferId != undefined || $rootScope.tmp.cartOfferId != null) {
            $rootScope.tmp = {};
            addToCart();
        }
	*/
	/* END TEMPORARY: PMP-178 */

        if($rootScope.tmp.comment != undefined || $rootScope.tmp.comment != null) {
            $scope.vm.comment = $rootScope.tmp.comment;
            $rootScope.tmp = {};
            submitComment();
        }

        return;


        //load the marker into the map object
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
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(mapCanvas, mapOptions);
            var marker = new google.maps.Marker({
                position: mapPosition,
                map: map
            });
        }

        //function to create the comment in the backend
        function submitComment() {
            var id = $scope.offerDetails.id;
            var comment = $scope.vm.comment.trim();
            if (!comment || comment.length == 0) {
                return;
            }
            if (UtilService.isLoggedIn()) {
                GiftCardOfferService.createComment(id, comment)
                    .then(function () {
                        $scope.vm.comment = null;
                        GiftCardOfferService.getComments(id)
                            .then(function (comments) {
                                $scope.offerDetails.comments = comments;
                                $scope.vm.commentsClosed = false;
                            }, function () {
                                $scope.handleError("Cannot get comments");
                            });
                    }, function () {
                        $scope.handleError('Cannot create comment')
                    });

            } else {
                $rootScope.tmp = {};
                $rootScope.tmp.redirectUrl = $location.url();
                $rootScope.tmp.comment = comment;
                $scope.ms.showModal('id010','login');
            }
        }

	/* BEGIN TEMPORARY: PMP-178 */
	/*
        //function to handle add cart action by the user.
        function addToCart() {
            if (UtilService.isLoggedIn()) {
                if (!$rootScope.isUser) {
                    $scope.ms.showModal('id019', 'alert');
                    return;
                }
                if (CartService.totalValue != null) {
                    CartService.giftOfferId = $routeParams.id;
                    $scope.ms.redirectUrl = '/my-cart';
                    $scope.ms.showModal('id011', 'continue');
                } else {
                    processCart();
                }
            } else {
                $rootScope.tmp = {};
                $rootScope.tmp.redirectUrl = $location.url();
                $rootScope.tmp.cartOfferId = $routeParams.id;
                $scope.ms.showModal('id005','login');
            }
        }
	*/

	//function to handle buy now action by the user.
	function buyNow() {
	    if (!$scope.buyNowDetails.value || $scope.buyNowDetails.value < 0 || $scope.buyNowDetails.value > $scope.offerDetails.availableQuantity) {
		$scope.buyNowDetails.value = $scope.offerDetails.availableQuantity;
		$scope.ms.showModal('id030', 'alert');
		return;
	    }
	    if (UtilService.isLoggedIn()) {
		if (!$rootScope.isUser) {
                    $scope.ms.showModal('id019', 'alert');
                    return;
                }
		var discount = parseFloat(100 - $scope.offerDetails.discount) / 100.0;
		var price = $scope.buyNowDetails.value * discount;
		CartService.price = Math.round(price * 100) / 100;
		CartService.giftOfferId = $routeParams.id;
		CartService.totalValue = $scope.buyNowDetails.value;
		$location.path('/payment');
	    } else {
		$rootScope.tmp = {};
                $rootScope.tmp.redirectUrl = $location.url();
                $rootScope.tmp.cartOfferId = $routeParams.id;
                $scope.ms.showModal('id005','login');
	    }
	}

	//check the buyNow value
	function checkBuyNowValue() {
	    if (!$scope.buyNowDetails.value || $scope.buyNowDetails.value < 0 || $scope.buyNowDetails.value > $scope.offerDetails.availableQuantity) {
		$scope.buyNowDetails.value = $scope.offerDetails.availableQuantity;
	    }
	    if (Math.floor($scope.buyNowDetails.value) != $scope.buyNowDetails.value) {
		// Only full dollar amounts (no cents) are allowed
		$scope.buyNowDetails.value = Math.floor($scope.buyNowDetails.value);
		$scope.ms.showModal('id031', 'alert');
	    }
	}
	/* END TEMPORARY: PMP-178 */

        //Route to my cart page on successful validation of add cart.
        function processCart() {
            CartService.giftOfferId = $routeParams.id;
            $location.path('/my-cart');
        }

    }

})();

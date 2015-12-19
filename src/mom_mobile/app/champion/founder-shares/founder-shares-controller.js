/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definition for my foundershares page
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Modified file name from champion-home to founder-shares.
 *  - Change the page layout to include slider.
 *  - Change page layout with link to send gift page.
 *  - Modified the controller name from ChampionHomeCtrl to FounderSharesCtrl
 *
 * Changes in 1.2: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Implement suggested offers (PMP-185)
 *
 * Changes in 1.3 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - Accept unopened gift
 */

(function () {
    'use strict';

    angular
        .module('app.champion.founderShares')
        .controller('FounderSharesCtrl', FounderSharesCtrl);

    FounderSharesCtrl.$inject = ['$scope', '$rootScope', '$route', 'GiftCardOfferService', 'StorageService', 'UtilService', 'DATA', 'GLOBAL_OPTIONS', '$location', 'ModalService', 'GiftCardService'];

    // Founder shares page controller
    function FounderSharesCtrl($scope, $rootScope, $route, GiftCardOfferService, StorageService, UtilService, DATA, GLOBAL_OPTIONS, $location, ModalService, GiftCardService) {
        $scope.resetGlobal(GLOBAL_OPTIONS);

        $scope.search = {};
        $scope.sort = {};
        $scope.vm = {};
        $scope.vm.showDetails = showDetails;

	var code = StorageService.getGiftToken();
	if(code) {
            GiftCardService.acceptGift(code, StorageService.getSessionToken()).then(function(gift) {
		StorageService.clearGiftToken();
		ModalService.showModal('id028', 'rate');
		ModalService.onClose = function() {
		    delete ModalService.onClose;
		    // We need to reload this controller so the gift gets displayed
		    $route.reload();
		};
		ModalService.currentMessage.ratingId = {
		    type: 'GIFT_ACCEPTED',
		    userId: $rootScope.loggedUser.id
		};
            })
	}
	
        var giftCardData = DATA;
        GiftCardOfferService.search({
            pageNumber: 0,
            ids: _.pluck(giftCardData.items, 'giftCardOfferId')
        }).then(function (result) {
            var groups = _.groupBy(result.items, "businessId");
            $scope.giftCardOffers = _.map(groups, function (group) {
                return group[0];
            });
            angular.forEach(giftCardData.items, function (giftCard) {
                if(giftCard.quantity === 0) {
                    return;
                }

                for (var i = $scope.giftCardOffers.length - 1; i >= 0; i--) {
                    var giftCarOffer = $scope.giftCardOffers[i];
                    if (giftCarOffer.businessId === giftCard.businessId) {
                        if (!giftCarOffer.giftCards) {
                            giftCarOffer.giftCards = [];
                            giftCarOffer.total = 0;
                        }
                        giftCarOffer.giftCards.push(giftCard);
                        giftCarOffer.total += giftCard.quantity;
                    }
                }
            });
            $scope.giftCardOffers = _.filter($scope.giftCardOffers, function (offer) {
                return offer.total;
            });
            if (!$scope.giftCardOffers.length) {
                GiftCardOfferService.search({
                    pageNumber: 1,
                    pageSize: 3,
                    lat: window.USER_LOCATION.latitude,
                    long: window.USER_LOCATION.longitude,
                    sortByDiscount: 1,
                    status: "ACTIVE"
                }).then(function (result) {
                    $scope.suggestedOffers = result.items;
                });
            }
            $scope.$broadcast('initslider');
        });

        if (UtilService.isLoggedIn()) {
            init();
        }

        //Display the modals with options
        $scope.vm.showOptions = function(id, offerId) {
            $scope.vm.giftCardId = id;
            $scope.vm.offerId = offerId;
            $scope.vm.isoptionsModal = true;
        };

        function init () {
            var profile = StorageService.getCurrentUserProfile();
            $scope.user.firstName = profile.firstName;
            $scope.user.lastName = profile.lastName;
        }

        //when user clicks on details of a particular offer,
        function showDetails(offerId) {
            $location.url('/offer-details/'+offerId + "?back=founder-shares");
        }

    }

})();

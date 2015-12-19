/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Offers Controller
 *
 * Changes in version 1.1:
 *  - Fixed the integration issues.
 *
 * Changes in version 1.2:
 *  - Add gift opening dialog
 *
 * Changes in version 1.3:
 *  - Added renew logic.
 *  - Added champions list logic.
 *
 * Changes in version 1.4:
 *  - Add total gifted to header in champion view
 *
 * Changes in version 1.5
 * - update native alert to notify alerts
 * - Update popup after user accepts gift card as gift
 *
 * Changes in version 1.6: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Implement suggested offers (PMP-185)
 *
 * Changes in version 1.7
 * - Fix redirect issue in modal gift accepted modal popup
 *
 * Changes in version 1.8 (Project Mom and Pop - MiscUpdate5):
 * - Add missing function documentation
 *
 * Changes in version 1.9:
 * - [PMP-251] Fix gift open process
 *
 * Changes in 1.10 (Authentication and Social Media Integration enhancement):
 * - [PMP-246] Update share text
 *
 * Changes in 1.11 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Roles are checked in more consistent way
 *
 * @version 1.11
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('giftCardOffersCtrl', ['$scope', '$rootScope', '$location', 'GiftCardOfferService', 'BusinessService', "storage", "roles", "util", "GiftCardService", "notify",
        function ($scope, $rootScope, $location, GiftCardOfferService, BusinessService, storage, roles, util, GiftCardService, notify) {
            $scope.nextSteps = false;
	    /**
	     * Show the next steps.
	     */
            $scope.showNextSteps = function() {
                $scope.nextSteps = true;
            }
	    /**
	     * Close the modal and go to a specific path.
	     * @param {String} [path] the path
	     */
            $scope.goto = function(path) {
                $scope.modal = false;
                $scope.modalOpened = false;
                $location.path(path);
            };

            $scope.totalAmountPurchased = 0;

            var user = storage.getCurrentUserProfile();
            $scope.shareCategory = "purchased card";

            if ($rootScope.isUser) {

                if ($rootScope.tmp.giftOpened) {
                    $scope.shareText = "Aw, thanks! I can't wait to shop at " + $rootScope.tmp.giftOpened.businessName + " with the FounderShare reward someone special just sent me :)";
                    $scope.shareTextTW = "Aw, thanks! I can't wait to shop with the FounderShare reward someone special just sent me :)";

                    $scope.shareCategory = "accepted gift";
                    $rootScope.tmp.giftOpened = null;
                    $scope.modalOpened = $scope.modal = true;
                }
		/**
		 * Close the modal
		 */
                $scope.closeModal = function () {
                    $scope.modalOpened = $scope.modal = false;
                };
		/**
		 * Show offer details.
		 * @param {String} [offerId] The offer id
		 */
                $scope.showInfo = function (offerId) {
                    $rootScope.$broadcast("showOfferPopup", offerId);
                };
                GiftCardService.search({pageNumber: 0}).then(function (result) {
                    var giftCards = [];
                    var allGiftCards = result.items;

                    for (var i=0; i<allGiftCards.length; i++) {
                        if (allGiftCards[i].quantity > 0) {
                            giftCards.push(allGiftCards[i]);
                        }
                    }

                    var indexed = _.groupBy(giftCards, 'businessId');
                    $scope.totalAmountPurchased = 0;
                    $scope.totalAmountRedeemed = 0;
                    $scope.totalAmountGifted = 0;
                    _.each(allGiftCards, function (card) {
                        if (card) {
                            var redeemed = _.reduce(card.giftCardRedeems, function (memo, redeem) {
                                return memo + redeem.amount;
                            }, 0);
                            $scope.totalAmountRedeemed += redeemed;
                            $scope.totalAmountPurchased += card.originalQuantity;
                            $scope.totalAmountGifted += card.originalQuantity - card.quantity - redeemed;
                        }
                    });
                    $scope.items = _.map(indexed, function (items) {
                        var item = _.pick(items[0], 'businessId', 'businessPicture');
                        item.offerId = items[0].giftCardOfferId;
                        item.sharesCount = items.length;
                        item.giftCards = items;
                        return item;
                    });
                    if (!allGiftCards.length) {
                        GiftCardOfferService.getAllGiftCardOffers({
                            pageNumber: 1,
                            pageSize: 4,
                            lat: window.USER_LOCATION.latitude,
                            long: window.USER_LOCATION.longitude,
                            sortByDiscount: 1,
                            status: "ACTIVE"
                        }).then(function (result) {
                            $scope.suggestedOffers = result.items;
                        }, function () {
                            notify({message: "Cannot suggest offers", templateUrl: 'partials/module/notify-popup.html'});
                        });
                    }
                }, function () {
                    notify({message: "Cannot get gift cards", templateUrl: 'partials/module/notify-popup.html'});
                });
                return;
            }



            if ($rootScope.isFounder) {

                BusinessService.getMyBusiness().then(function (business) {
                    $scope.business = business;
                }, function () {
                    notify({message: "Cannot get business", templateUrl: 'partials/module/notify-popup.html'});
                });

                var businessId = $rootScope.loggedUser.businessId;
                $scope.emptyOffers = false;
                GiftCardOfferService.getAllGiftCardOffers({pageNumber: 0, businessId: businessId, sortOrder: "Descending"}).then(function (result) {
                    var offers = result.items;
                    $scope.offers = offers;
                    $scope.emptyOffers = !offers.length;

                    // calculate total values
                    var totalSold = 0, totalRedeemed = 0;
                    angular.forEach(offers, function (offer) {
                        totalSold += offer.totalQuantity - offer.availableQuantity;
                        totalRedeemed += offer.redeemedQuantity;
                        offer.purchased = 0;
                        offer.redeems = 0;
                    });
                    $scope.totalAmountSold = totalSold;
                    $scope.totalAmountRedeemed = totalRedeemed;
                    $scope.totalCount = offers.length;


                    GiftCardService.searchAll({pageNumber: 0}).then(function (result) {
                        angular.forEach(result.items, function (card) {
                            angular.forEach($scope.offers, function (offer) {
                                if (card.giftCardOfferId == offer.id) {
                                    offer.purchased += 1;
                                    if (card.giftCardRedeems) {
                                        offer.redeems += card.giftCardRedeems.length;
                                    }
                                }
                            });
                        });
                    }, function () {
                        notify({message: "Cannot get gift cards", templateUrl: 'partials/module/notify-popup.html'});
                    });
                }, function () {
                    notify({message: "Cannot get gift cards", templateUrl: 'partials/module/notify-popup.html'});
                });
            }


            //cancel the offer
            $scope.cancel = function (offer) {
                GiftCardOfferService.cancelGiftCard(offer.id).then(function () {
                    offer.status = "CANCELLED";
                }, function () {
                    notify({message: "Cannot cancel posting", templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            /**
             * Renew the offer.
             * @param offer the offer instance
             */
            $scope.renew = function (offer) {
                GiftCardOfferService.renewGiftCard(offer.id).then(function () {
                    offer.status = "ACTIVE";
                }, function () {
                    notify({message: "Cannot cancel posting", templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            /**
             * Popup champions list.
             * @param id the offer id.
             */
            $scope.seeChampions = function(id) {
                $rootScope.$broadcast("showViewChampionsPopup", id);
            };
        }]);

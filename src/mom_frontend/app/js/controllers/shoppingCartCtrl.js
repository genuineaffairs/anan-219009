/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Shopping cart controller.
 *
 * Changes in version 1.1:
 *  - Allow only 2000 maximum quantity
 *
 * Changes in version 1.2
 * - Update popup after purchase of gift card offer
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.3:
 * - [PMP-178] Temporarily disable Shopping Cart and replace with Buy Now
 *
 * Changes in version 1.4
 * - Fix redirect issue in after purchase popup
 *
 * Changes in version 1.5 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-198] Update payment error message
 * - Add missing function documentation
 *
 * Changes in version 1.6 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - unLoginModal should not show on success
 *
 * Changes in 1.7 (Authentication and Social Media Integration enhancement):
 * - [PMP-246] Update share text
 *
 * Changes in 1.8 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Checking role uses consistent $rootScope.isXXX variable
 *
 * @version 1.8
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("shoppingCartCtrl", ['$scope', '$q', 'storage', '$rootScope', '$location', 'GiftCardOfferService', 'config', 'notify', 'util',
	function ($scope, $q, storage, $rootScope, $location, GiftCardOfferService, config, notify, util) {

        $scope.shareText = "I just got rewarded for shopping local. You can too!";
        $scope.shareTextTw = "I just got rewarded for shopping local. You can too!";
        
	    /* BEGIN TEMPORARY: [PMP-178]
	     * Check for a hash value #pay in the url to bypass the cart
	     * Expect a search of ?id=cardId&value=value
	     */
	    if ($location.hash() == 'pay') {
		if (!$rootScope.isUser) {
		    /* Only logged in users can buy a gift card */
		    $location.hash('');
		    $location.path('/Home');
		    return;
		}
		/**
		 * Close the modal and go to a specific path.
		 * @param {String} [path] The path
		 */
		$scope.goto = function(path) {
		    $scope.modal = false;
		    $scope.modalOpened = false;
		    $location.path(path);
		};
		var offerId = $location.search().id;
		var value = $location.search().value;
		GiftCardOfferService.getGiftCardOffer(offerId).then(function(offer) {
		    offer.value = value;
		    if (offer.status !== "ACTIVE") {
			/* If offer is inactive, notify the user and
			 * redirect to home page */
			notify({message: "The offer is inactive.", templateUrl: 'partials/module/notify-popup.html'});
			$location.path('/Home');
		    }
		    $scope.offers = [offer];
		    $scope.showNextSteps = function() {
			$scope.nextSteps = true;
		    }
		    $scope.pay();
		    if (offer.invalid) {
			/* The offer was marked as invalid by the pay
			 * process (maxAmount). The user was already
			 * notified. Redirect to home page. */
			$location.path('/Home');
		    }
		});
	    } else {
		/* END TEMPORARY: [PMP-178] */

		$scope.nextSteps = false;
		$scope.view = 'cart';
		var promises = _.map(storage.getItemFromCart(), function (offerId) {
		    return GiftCardOfferService.getGiftCardOffer(offerId);
		});

		$q.all(promises).then(function (offers) {
		    $scope.offers = _.filter(offers, function (offer) {
			if (offer.status !== "ACTIVE") {
			    storage.removeItemFromCart(offer.id);
			    return false;
			}
			offer.value = 0;
			return true;
		    })
		});
	    }

	    $scope.showNextSteps = function() {
		$scope.nextSteps = true;
	    };

	    var tokenPromise = GiftCardOfferService.getBraintreeToken().then(function (data) {
		return data.token;
	    }, function () {
		notify({message: "Cannot get braintree token.", templateUrl: 'partials/module/notify-popup.html'});
	    });

	    /**
	     * Go to the payment page.
	     */
	    $scope.pay = function () {
		var maxAmount = false;
		if (!$scope.offers.length || _.any($scope.offers, function (offer) {
		    if (!offer.value) {
			offer.invalid = true;
			return true;
		    }
		    if (offer.value > 2000) {
			offer.invalid = true;
			maxAmount = true;
			return true;
		    }
		    return false;
		})) {
		    if (maxAmount) {
			notify({message: "Maximum allowed amount is $2000", templateUrl: 'partials/module/notify-popup.html'});
		    }
		    return;
		}

		$scope.totalPrice = 0;
		_.each($scope.offers, function(offer) {
		    var price = (Number(offer.value) * (100-Number(offer.discount))/100);
		    $scope.totalPrice += price;
		});
		$scope.view = 'payment';

		tokenPromise.then(function (data) {
		    braintree.setup(data, 'dropin', {
			container: 'dropin-container',
			paymentMethodNonceReceived: function (event, nonce) {
			    if (config.FAKE_NONCE) {
				nonce = 'fake-valid-nonce'; //FAKE NONCE for testing
			    }
			    GiftCardOfferService.purchase(_.map($scope.offers, function (offer) {
				return {
				    "paymentMethodNonce": nonce,
				    "giftCardOfferId": offer.id,
				    "quantity": Number(offer.value)
				}
			    })).then(function () {
				$scope.verificationName = 'It is a great local biz - they are doing something cool. Take a look ';
				$rootScope.modal = true;
				_.each($scope.offers, function (offer) {
				    storage.removeItemFromCart(offer.id);
				})
				    }, function (reason) {
					notify({message: 'Oops! Your payment didn\'t go through. You can give it another try, or let support know that you had a problem with payment.', templateUrl: 'partials/module/notify-popup.html'});
				    });
			}
		    });
		});
	    };

	    /**
	     * Get total amount of all items in cart
	     * @returns {Number} the total amount
	     */
	    $scope.getTotal = function () {
		return _.reduce($scope.offers, function (memo, offer) {
		    if (!offer.value) {
			return memo;
		    }
		    var price = offer.value * (100 - offer.discount) / 100;
		    price = Math.round(price * 100) / 100;
		    return memo + price;
		}, 0);
	    };

	    /**
	     * Close the modal.
	     */
	    $scope.cancel = function () {
		$rootScope.modal = false;
	    };
	    /**
	     * Delete the item.
	     * @param offer the offer
	     */
	    $scope.delete = function (offer) {
		storage.removeItemFromCart(offer.id);
		$scope.offers = _.without($scope.offers, offer);
	    };
	    /**
	     * Close the modal.
	     */
	    $scope.closeModal = function () {
		$rootScope.modal = false;
		$location.path('/Founder$hares');
	    };
	}]);

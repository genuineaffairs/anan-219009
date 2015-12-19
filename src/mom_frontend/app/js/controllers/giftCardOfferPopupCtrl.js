/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for gift card offer details
 *
 * Changes in version 1.1:
 *  - Added removePosting() and removeComment() method.
 *
 * Changes in version 1.2:
 *  - Remember created comment if user is not logged in (create comment after logging in)
 *  - Same feature for invite friend
 *
 * Changes in version 1.3
 * - Change "No expiration date" to "Offer expires in [x] days"
 *
 * Changes in version 1.4:
 * - [PMP-178] Temporarily disable Shopping Cart and replace with Buy Now
 *
 * Changes in version 1.5 (Project Mom and Pop - Gift Card Offers Search and View):
 * - Don't load google maps script
 *
 * Changes in version 1.6 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-198] Update wording of emailToFriend success message
 * - [PMP-214] Fix email friend function
 * - [PMP-215] Fix days remaining
 * - [PMP-214] Email friend button deactivated while sending email
 *
 * Changes in version 1.7 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-223] Add slider
 * - Change map zoom factor to 16
 *
 * Changes in 1.8 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] User roles are checked in consistent way
 *
 * @version 1.8
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("giftCardOfferPopupCtrl", ['$scope', '$rootScope', '$location', 'BusinessService', 'SharingService',
        "NotificationService", "GiftCardOfferService", 'storage', '$log', 'util', 'config', "$timeout", "notify",
        function ($scope, $rootScope, $location, BusinessService, SharingService,
                  NotificationService, GiftCardOfferService, storage, $log, util, config, $timeout, notify) {
            $scope.comment = {text: ""};
            // close view details
            $scope.closeInfo = function () {
                $scope.hidePopup();
            };

            $scope.showPopup = function () {
                $scope.comment.text = "";
                $scope.display = true;
                $rootScope.details = true;
            };

            $scope.hidePopup = function () {
                $scope.display = false;
                $rootScope.details = false;
            };

            // add comment
            $scope.checkComment = function () {
                $scope.check = true;
            };


            function loadMap() {
                var lat = 0,
                    lng = 0;
                if ($scope.detailGiftCardOffer && $scope.detailGiftCardOffer.coordinates) {
                    lat = $scope.detailGiftCardOffer.coordinates[1];
                    lng = $scope.detailGiftCardOffer.coordinates[0];
                }

                var mapPosition = new google.maps.LatLng(lat, lng);
                var mapCanvas = $('#map-canvas').get(0);
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

            /* BEGIN TEMPORARY: PMP-178 */

            /**
             * Add the item to cart.
             * @param detailGiftCardOffer the given item to add
             */
            /*
             $scope.addToCard = function (detailGiftCardOffer) {
             if (!config.FAKE_NONCE) {
             storage.clearCart();
             }
             storage.addItemToCart(detailGiftCardOffer.id);
             if (util.isLoggedIn()) {
             $scope.hidePopup();
             $location.path('/ShoppingCart');
             } else {
             $scope.hidePopup();
             $location.path('/Login');
             }
             };
             */


            /**
             * TEMPORARY: [PMP-178]
             * Buy the item now and skip the shopping cart.
             * @param detailGiftCardOffer the given item to buy
             * @param value the value to put on the card
             */
            $scope.doBuyNow = function (detailGiftCardOffer, value) {
                if (Math.floor(value) != value) {
                    // Only full dollar amounts (no cents) are allowed
                    $scope.buyNow.value = Math.floor($scope.buyNow.value);
                    notify({message: "For now, gift card purchases have to be in whole dollar amounts (no cents).", templateUrl: 'partials/module/notify-popup.html'});
                    return;
                }
                if (!value || value > $scope.detailGiftCardOffer.availableQuantity) {
                    $scope.buyNow.invalid = true;
                    $scope.buyNow.value = $scope.detailGiftCardOffer.availableQuantity;
                    notify({message: "Whoops! Looks like you're trying to buy more than what's available.", templateUrl: 'partials/module/notify-popup.html'});
                    return;
                }
                var cartUrl = '/ShoppingCart?id='+detailGiftCardOffer.id+'&value='+value+'#pay';
                if ($rootScope.isUser) {
                    $scope.hidePopup();
                    $location.url(cartUrl);
                } else if (!util.isLoggedIn()) {
                    $scope.hidePopup();
                    /* Redirect to payment page after login */
                    $rootScope.tmp = {
                        redirectUrl: cartUrl
                    };
                    $location.path('/Login');
                } else {
                    /* This case should never be reached. But just in
                     * case, redirect to home. */
                    $location.path('/Home');
                }
            };

            //Update the range slider step size
            $scope.sliderChanged = function() {
                $scope.buyNow.value = parseFloat($scope.buyNow.value);
                if ($scope.detailGiftCardOffer.availableQuantity - $scope.buyNow.value < 10) {
                    $scope.buyNow.step = 1;
                } else if ($scope.buyNow.value < 100) {
                    $scope.buyNow.step = 1;
                } else if ($scope.buyNow.value < 500) {
                    $scope.buyNow.step = 5;
                } else {
                    $scope.buyNow.step = 10;
                }
            };

            /**
             * Show popup with details
             * @param offerId the offer id
             */
            $scope.showInfo = function (offerId) {
                GiftCardOfferService.getGiftCardOffer(offerId).then(function (item) {
                    $scope.detailGiftCardOffer = item;

                    // put conditions into an array
                    $scope.conditions = [];
                    _.each(item.platformConditions.split('\n'), function(c) {
                        $scope.conditions.push(c);
                    });
                    if (item.conditions && item.conditions.trim().length) {
                        $scope.conditions.push(item.conditions);
                    }

                    /* BEGIN TEMPORARY: [PMP-178] */
                    /* Buy now fields. We save the value and an
                     * invalid flag. Initialize value to a default
                     * (configuable) value or to available
                     * quantity. */
                    var initialValue = config.DEFAULT_BUY_NOW_VALUE;
                    if (initialValue > $scope.detailGiftCardOffer.availableQuantity) {
                        initialValue = $scope.detailGiftCardOffer.availableQuantity;
                    }
                    $scope.buyNow = {
                        value: initialValue,
                        min: config.MIN_BUY_NOW_VALUE,
                        step: 1,
                        invalid: false
                    };

                    /* END TEMPORARY: [PMP-178] */

                    $scope.showPopup();

                    $scope.daysRemaining = Math.floor((new Date($scope.detailGiftCardOffer.expirationDate).getTime() - new Date().getTime()) / (24 * 3600 * 1000));
                    if ($scope.daysRemaining < 0) {
                        $scope.daysRemaining = 'expired';
                    }
                    BusinessService.getBusiness(item.businessId).then(function (data) {
                        delete data.id;
                        angular.extend($scope.detailGiftCardOffer, _.omit(data, 'description'));
                        $scope.detailGiftCardOffer.address =
                            data.streetAddress + ' ' + data.city + ', ' + data.state + ' ' + data.country + ' ' + data.zip;
                        loadMap();

                        GiftCardOfferService.getGiftCardOfferComments(item.id).then(function (comments) {
                            $scope.detailGiftCardOffer.comments = comments;
                        }, function () {
                            notify({message: "Cannot get comments", templateUrl: 'partials/module/notify-popup.html'});
                        });

                        if ($rootScope.tmp.pendingInvite) {
                            var invite = $rootScope.tmp.pendingInvite;
                            $rootScope.tmp.pendingInvite = null;
                            $scope.friendEmail = invite.friendEmail;
                            NotificationService.invitations(invite).then(function () {
                                notify({message: "Email has sent to " + invite.friendEmail + " successfully!", templateUrl: 'partials/module/notify-popup.html'});
                            }, function (data) {
                                notify({message: data.error, templateUrl: 'partials/module/notify-popup.html'});
                            });
                        }

                    }, function () {
                        notify({message: "Cannot get business details", templateUrl: 'partials/module/notify-popup.html'});
                    });
                }, function () {
                    notify({message: "Cannot get gift card offer", templateUrl: 'partials/module/notify-popup.html'});
                });
            };


            $scope.checkEnter = function ($event) {
                if ($event.keyCode == 13) {
                    var comment = $scope.comment.text.trim();
                    if (!comment) {
                        $event.preventDefault();
                        return;
                    }
                    $scope.submitComment();
                }
            };

            $scope.submitComment = function () {
                var giftCardOfferId = $scope.detailGiftCardOffer.id;
                var comment = $scope.comment.text.trim();
                if (!comment) {
                    return;
                }
                if (util.isLoggedIn()) {
                    $timeout(function () {
                        $scope.comment.text = "";
                    });
                    GiftCardOfferService.createGiftCardOfferComment(giftCardOfferId, comment).then(function () {
                        GiftCardOfferService.getGiftCardOfferComments(giftCardOfferId).then(function (comments) {
                            $scope.detailGiftCardOffer.comments = comments;
                        }, function () {
                            notify({message: "Cannot get comments", templateUrl: 'partials/module/notify-popup.html'});
                        });
                    }, function () {
                        notify({message: "Cannot create comment", templateUrl: 'partials/module/notify-popup.html'});
                    });
                } else {
                    $rootScope.tmp.pendingComment = {
                        comment: comment,
                        giftCardOfferId: giftCardOfferId
                    };
                    $scope.hidePopup();
                    $location.path('/Login');
                }
            };

            $scope.share = {
                emailError: false,
                emailSending: false,
                friendEmail: ''
            };

            $scope.emailToFriend = function (offerId, offerTitle) {
                if ($scope.share.emailSending) {
                    return;
                }
                var friendEmail = $scope.share.friendEmail;
                if (friendEmail && friendEmail.indexOf('@') > 1) {
                    if (util.isLoggedIn()) {
                        $scope.share.emailError = false;
                        $scope.share.emailSending = true;
                        var friendInvitation = {
                            "friendEmail": friendEmail,
                            "offerId": offerId,
                            "offerTitle": offerTitle
                        };
                        NotificationService.invitations(friendInvitation).then(function (data) {
                            $scope.share.emailSending = false;
                            notify({message: "You are so thoughtful! Your buddy just got an email with a link to this page.", templateUrl: 'partials/module/notify-popup.html'});
                            /* Reset friendEmail */
                            $scope.share.friendEmail = '';
                        }, function (data) {
                            notify({message: data.error, templateUrl: 'partials/module/notify-popup.html'});
                        });
                    } else {
                        $scope.hidePopup();
                        $scope.share.friendEmail = '';
                        $rootScope.tmp.redirectUrl = "/?offerId=" + offerId;
                        $rootScope.tmp.pendingInvite = {
                            "friendEmail": friendEmail,
                            "offerId": offerId,
                            "offerTitle": offerTitle
                        };
                        $location.path('/Login');
                    }
                } else {
                    $scope.share.emailError = true;
                }
            };

            $scope.$on("showOfferPopup", function (e, offerId) {
                GiftCardOfferService.increaseViewCount(offerId).then(function () {
                    $scope.showInfo(offerId);
                }, function () {
                    notify({message: "Cannot increase view count.", templateUrl: 'partials/module/notify-popup.html'});
                });

            });


            /**
             * Remove posting.
             * @param id the posting id.
             */
            $scope.removePosting = function(id) {
                GiftCardOfferService.removeGiftCardOffer(id).then(function () {
                    $scope.hidePopup();
                    $rootScope.$broadcast("reloadAllPostings", id);
                }, function () {
                    notify({message: "Cannot remove gift card offer", templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            /**
             * Remove comment.
             * @param commentId - the comment id.
             * @param businessId - the business id.
             */
            $scope.removeComment = function(commentId, businessId) {
                GiftCardOfferService.removeGiftCardOfferComment(commentId, businessId).then(function () {
                    GiftCardOfferService.getGiftCardOfferComments($scope.detailGiftCardOffer.id).then(function (comments) {
                        $scope.detailGiftCardOffer.comments = comments;
                    }, function () {
                        notify({message: "Cannot get comments", templateUrl: 'partials/module/notify-popup.html'});
                    });
                }, function () {
                    notify({message: "Cannot remove comment", templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            $scope.shareSocial = {};
            $scope.shareSocial.share = function () {
                notify.closeAll();
                var content = {
                    message: $scope.shareSocial.message,
                    link: config.MOBILE_SERVICE_BASE_URL + '' + '#/offer-details/' + $scope.detailGiftCardOffer.id,
                    name: $scope.detailGiftCardOffer.businessName,
                    description: $scope.detailGiftCardOffer.description,
                    caption: 'FounderShare',
                    image: $scope.detailGiftCardOffer.businessPicture
                };
                var promise = util.isLoggedIn()
                    ? SharingService.share($scope.shareSocial.type, content)
                    : SharingService.shareOffline($scope.shareSocial.type, content);
                promise.then(function () {
                    notify({message: "Your message is shared successfully!", templateUrl: 'partials/module/notify-popup.html'});
                }, function(reason){
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            };
            $scope.shareSocial.openPopup = function (type, businessName) {
                $scope.shareSocial.type = type;
                $scope.shareSocial.businessName = businessName;
                if(type !== 'TWITTER') {
                    $scope.shareSocial.message = "If you haven't checked out "+ businessName +", " +
                        "you're missing out! Click here to find out more about them and discover other great local businesses.  "
                } else {
                    $scope.shareSocial.message = "Check out "+ businessName +"! " +
                        "Find out more about them and discover other great local businesses."
                }
                var connection = $rootScope.loggedUser && _.findWhere($rootScope.loggedUser.linkedSocialNetworks, {"socialNetwork": type});
                if(!connection && util.isLoggedIn()) {
                    util.connectToSocialNetwork(type).then(function () {
                        util.refreshUser();
                        notify({templateUrl: 'partials/module/share-popup.html', scope: $scope, duration: 0});
                    });
                } else if (!util.isLoggedIn()) {
                    SharingService.addLocalConnection(type).then(function () {
                        notify({templateUrl: 'partials/module/share-popup.html', scope: $scope, duration: 0});
                    });
                } else notify({templateUrl: 'partials/module/share-popup.html', scope: $scope, duration: 0});
            }
        }]);

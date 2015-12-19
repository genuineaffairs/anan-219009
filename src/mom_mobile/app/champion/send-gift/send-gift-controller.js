/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for sending gift
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1
 *  - Modified the select twitter friend flow
 *
 * Changes in version 1.2 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-198] Update wording of success message
 *
 * Changes in 1.3 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-224] Implement user feedback
 * - [PMP-223] Add slider
 */

(function () {
    'use strict';

    angular
        .module('app.champion.sendGift')
        .controller('SendGiftCtrl', SendGiftCtrl);

    SendGiftCtrl.$inject = ['$scope','$rootScope', '$routeParams', '$q', 'GiftCardService', 'ModalService', '$modal',
        'giftCard', 'GLOBAL_OPTIONS'];

    //Send gift controller
    function SendGiftCtrl($scope, $rootScope, $routeParams, $q, GiftCardService, ModalService, $modal,
                         giftCard, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);
        $scope.giftCard = giftCard;
        $scope.gifting = {
	    amount: Math.ceil(giftCard.quantity / 2)
	};
        $scope.vm = {};
        $scope.vm.twitterDeferred = $q.defer();
        $scope.vm.twitterFriends = [];
	$scope.vm.step = 1;
        $scope.ms = ModalService;
        $scope.ms.giftCard = giftCard;

        $scope.vm.submitting = false;

	$scope.vm.sliderChanged = sliderChanged;

        $scope.vm.sendGift = sendGift;
	$scope.vm.checkGiftValue = checkGiftValue;

        $scope.vm.selectTwitterFriends = selectTwitterFriends;

        var twitter = {
            api: null,
            token: null,
            tokenSecret: null
        };
        var modalInstance;

        return;

	//Handle slider changed event
	function sliderChanged() {
	    $scope.gifting.amount = parseFloat($scope.gifting.amount);
	    if ($scope.giftCard.quantity - $scope.gifting.amount < 10) {
		$scope.vm.step = 1;
	    } else if ($scope.gifting.amount < 100) {
		$scope.vm.step = 1;
	    } else if ($scope.gifting.amount < 500) {
		$scope.vm.step = 5;
	    } else {
		$scope.vm.step = 10;
	    }
	}
	
        //function to call gift email api based on whether the input is a twitter handle or
        //phone number or email
        function sendGift() {
            if ($scope.vm.submitting) {
                return;
            }
	    if (!$scope.gifting.amount || $scope.giftCard.quantity < Number($scope.gifting.amount)) {
		$scope.ms.showModal('id029', 'alert');
		$scope.gifting.amount = $scope.giftCard.quantity;
		return;
	    }
            $scope.vm.submitting = true;
            var promise;
            if ($scope.vm.selectedTwitterFriend) {
                promise = GiftCardService.sendGiftToTwitter($routeParams.giftCardId, {
                    accessToken: twitter.token,
                    accessTokenSecret: twitter.tokenSecret,
                    friendId: $scope.vm.selectedTwitterFriend.id_str,
                    quantity: Number($scope.gifting.amount)
                });
            } else {
                var target = $scope.gifting.receipt;
                var type = target.indexOf("@") === -1 ? "PHONE_NUMBER" : "EMAIL";
                promise = GiftCardService.sendGift($routeParams.giftCardId,
                    {
                        target: target,
                        quantity: Number($scope.gifting.amount),
                        type: type,
                        extraMessage: $scope.gifting.message || undefined
                    })
            }
            promise.then(function () {
                GiftCardService.getMyGiftCard($routeParams.giftCardId)
                    .then(function (response) {
                        $scope.giftCard = response;
                    });
                $scope.gifting = {};
                $scope.vm.selectedTwitterFriend = undefined;
                $scope.vm.submitting = false;
                $scope.ms.giftCard = giftCard;
                $scope.ms.redirectUrl = '/founder-shares';
                $scope.ms.showModal('id026', 'rate');
		$scope.ms.currentMessage.ratingId = {
		    type: 'GIFTED',
		    giftCardId: $routeParams.giftCardId,
		    userId: $rootScope.loggedUser.id
		};
            }, function (res) {
                $scope.vm.submitting = false;
                $scope.ms.showModal('id015', 'alert');
            })
        }

	//Check the gift value
	function checkGiftValue() {
	    if (!$scope.gifting.amount || $scope.giftCard.quantity < Number($scope.gifting.amount)) {
		$scope.gifting.amount = $scope.giftCard.quantity;
	    }
	    if (Math.floor($scope.gifting.amount) != $scope.gifting.amount) {
		// Only full dollar amounts (no cents) are allowed
		$scope.gifting.amount = Math.floor($scope.gifting.amount);
		$scope.ms.showModal('id032', 'alert');
	    }
	}

        //function to open the select twitter friends modal and update the recipient field based on
        //selection in the modal
        function selectTwitterFriends() {
            OAuth.popup('twitter').done(function (result) {
                twitter.token = result.oauth_token;
                twitter.tokenSecret = result.oauth_token_secret;
                twitter.api = result;
                modalInstance = $modal.open({
                    windowTemplateUrl: 'champion/send-gift/twitter-window.html',
                    templateUrl: 'select-twitter-friends.html',
                    controller: 'SelectTwitterCtrl',
                    size: 'lg',
                    resolve: {
                        twitterFriends: twitterFriendsResolve
                    }
                });

                modalInstance.result
                    .then(function (result) {
                        $scope.vm.selectedTwitterFriend = result.selectedTwitterFriend;
                        sendGift();
                    }, function (reason) {
                        if (reason === 'id017' || reason === 'id018') {
                            $scope.ms.showModal(reason, 'alert');
                        }
                    })

            }).fail(function (err) {
                $scope.ms.showModal('id016', 'alert');
                $scope.$apply();
            });
        }

        //Function to get all the twitter friends before opening the modal
        function twitterFriendsResolve() {
            if ($scope.vm.twitterFriends.length > 0) {
                $scope.vm.twitterDeferred.resolve($scope.vm.twitterFriends);
            } else {
                twitter.api
                    .get('/1.1/friends/list.json?count=200')
                    .done(function (data) {
                        if (data.users.length === 0) {
                            $scope.vm.twitterDeferred.reject();
                            $scope.ms.showModal('id017', 'alert');
                            return;
                        }
                        Array.prototype.push.apply($scope.vm.twitterFriends, data.users);
                        if (data.next_cursor) {
                            loadTwitterCursor(data.next_cursor);
                        } else {
                            $scope.vm.twitterDeferred.resolve($scope.vm.twitterFriends)
                        }
                    })
                    .fail(handleTwitterError);

            }
            return $scope.vm.twitterDeferred.promise;
        }

        //Function to get the twitter friends based on input cursor
        function loadTwitterCursor(cursor){
            twitter.api
                .get('/1.1/friends/list.json?cursor=' + cursor)
                .done(function (data) {
                    Array.prototype.push.apply($scope.vm.twitterFriends,data.users);
                    if(data.next_cursor) {
                        loadTwitterCursor(data.next_cursor);
                    } else {
                        $scope.vm.twitterDeferred.resolve($scope.vm.twitterFriends)
                    }
                })
                .fail(handleTwitterError);
        }

        //handle errors from twitter api
        function handleTwitterError(err) {
            $scope.vm.twitterDeferred.reject();
            if (err && err.status === 429) {
                $scope.ms.showModal('id018', 'alert');
                return;
            }
            $scope.ms.showModal('id017', 'alert');
        }
    }
})();

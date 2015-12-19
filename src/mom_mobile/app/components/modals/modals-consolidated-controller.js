/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for new modals
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included ability to build share buttons based on giftCard details
 *
 * Changes in 1.2 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-214] Reset email field after successfully sending offer to a friend
 * - Fix offerTitle in sendEmail
 *
 * Changes in 1.3 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-224] Implement user feedback
 * - Call onClose callback function when modal is closed
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .controller('ModalsConsolidatedCtrl', ModalsConsolidatedCtrl);

    ModalsConsolidatedCtrl.$inject = ['$rootScope', '$scope', '$location', '$window', 'ModalService', 'NotificationService',
        'UtilService', 'appConfig'];

    // Modals dialog controller
    function ModalsConsolidatedCtrl($rootScope, $scope, $location, $window, ModalService, NotificationService,
                          UtilService, appConfig) {
        $scope.vm = ModalService;
        $scope.fn = {};

        var shareDetails = {};
        var shareMessage = 'It is a great local biz - they are doing something cool. Take a look ';

        $scope.fn.close = close;
	$scope.fn.closeRating = closeRating;
	$scope.fn.toggleRating = toggleRating;
        $scope.fn.redirect = redirect;
        $scope.fn.shareOn = shareOn;
        $scope.fn.sendEmail = sendEmail;
	
        return;

        //function to close the modal
        function close(flag, redirect) {
            $scope.vm[flag] = false;
	    if ($scope.vm.onClose) {
		$scope.vm.onClose();
	    }
            if(redirect && $scope.vm.redirectUrl !== undefined && $scope.vm.redirectUrl !== null){
                $location.path($scope.vm.redirectUrl);
            }
        }

	//function to close the rating modal
	function closeRating(redirect) {
	    $scope.vm.flagRateAppModal = false;
	    $scope.vm.saveRating().then(function() {
		$scope.vm.clearRatings();
		close('flagRateAppModal', redirect);
	    });
	}

	// Set rating to value or 0
	function toggleRating(rating, value) {
	    if (rating.rating === value) {
		rating.rating = 0;
	    } else {
		rating.rating = value;
	    }
	}

        //function to redirect the page
        function redirect(flag, uri){
            $scope.vm[flag] = false;
            if( uri === undefined || uri === null) {
                uri = '/';
            }
            $location.path(uri);
        }

        //The offerDetails or giftCard in modal service ($scope.vm)
        // should be populated before calling this method
        function shareOn(flag, destination) {
            $scope.vm[flag]=false;
            var pageUrl = $location.absUrl().split('#')[0];
            var pattern = /^https?:\/\/|^\/\//i;

            shareDetails = {};

            if($scope.vm.offerDetails !== undefined && $scope.vm.offerDetails !== null) {
                shareDetails.url = pageUrl +'#/?offerId='+$scope.vm.offerDetails.id;
                shareDetails.title = $scope.vm.offerDetails.businessName;
                shareDetails.description = $scope.vm.offerDetails.description;
                if(pattern.test($scope.vm.offerDetails.businessPicture)) {
                    shareDetails.logo = $scope.vm.offerDetails.businessPicture;
                } else {
                    shareDetails.logo = pageUrl + $scope.vm.offerDetails.businessPicture;
                }
            } else if($scope.vm.giftCard !== undefined && $scope.vm.giftCard !== null) {
                shareDetails.url = pageUrl +'#/?offerId='+$scope.vm.giftCard.giftCardOfferId;
                shareDetails.title = $scope.vm.giftCard.businessName;
                shareDetails.description = $scope.vm.giftCard.description;
                if(pattern.test($scope.vm.giftCard.businessPicture)) {
                    shareDetails.logo = $scope.vm.giftCard.businessPicture;
                } else {
                    shareDetails.logo = pageUrl + $scope.vm.giftCard.businessPicture;
                }
            } else {
                return;
            }

            if(destination === 'facebook'){
                showFB();
            } else if(destination === 'linkedin') {
                showLinkedin();
            } else if(destination === 'googleplus') {
                showGplus();
            } else if(destination === 'twitter') {
                showTwitter();
            }

            if($scope.vm.redirectUrl !== undefined && $scope.vm.redirectUrl !== null){
                $location.path($scope.vm.redirectUrl);
            }
        }

        //The offerDetails in modal service ($scope.vm)
        // should be populated before calling this method
        function sendEmail(flag){
            if (!$scope.fn.email){
                return;
            }
            $scope.vm[flag] = false;
            if (!UtilService.isLoggedIn()) {
                $rootScope.tmp.redirectUrl = $location.url();
                $scope.vm.showModal('id005', 'login');
                return;
            } else {
                var friendInvitation = {
                    "friendEmail": $scope.fn.email,
                    "offerId": $scope.vm.offerDetails.id,
                    "offerTitle": $scope.vm.offerDetails.businessName
                };
                NotificationService.invitations(friendInvitation)
                    .then(function(data) {
			$scope.fn.email = '';
                        $scope.vm.showModal('id014', 'shareSuccess');
                    }, function(response){
                        $scope.vm.showModal('id013', 'alert');
                    })
            }
        }


        //Load facebook jssdk if not loaded and calls the displayFB function once loaded
        function showFB() {
            if ($('#facebook-jssdk').length) {
                displayFB();
                return;
            }

            // initialize function for facebook sdk
            $window.fbAsyncInit = function() {
                delete $window.fbAsyncInit;
                FB.init({
                    appId: appConfig.FB_APP_ID,
                    xfbml: true,
                    version: 'v2.4'
                });
                displayFB();

            };

            var div = document.createElement('div');
            div.setAttribute('id', 'fb-root');
            document.body.appendChild(div);

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = 'facebook-jssdk';
            script.src = 'https://connect.facebook.net/en_US/sdk.js';
            document.body.appendChild(script);

            return;
        }

        //Function to render facebook feed dialog.
        function displayFB() {
            FB.ui(
                {
                    method: 'feed',
                    link: shareDetails.url,
                    name: shareDetails.title,
                    caption: shareMessage,
                    description: shareDetails.description,
                    picture: shareDetails.logo
                },
                function(response) {
                    if (response && !response.error_code) {
                        $scope.vm.showModal('id020', 'shareSuccess');
                    } else {
                        $scope.vm.showModal('id004', 'alert');
                    }
                    $scope.$apply();
                }
            );
        }

        //function to load linkedin share dialog
        function showLinkedin() {
            var summary = shareDetails.description;
            var shareUrl = 'https://www.linkedin.com/shareArticle?&mini=true';
            if (summary.length > 256) {
                summary = summary.substring(0,255);
            }
            shareUrl += '&url=' + encodeURIComponent(shareDetails.url);
            shareUrl += '&title=' + encodeURIComponent(shareDetails.title);
            shareUrl += '&summary=' + encodeURIComponent(summary);
            $window.open(shareUrl,'LinkedIn Sharer','toolbar=0,status=0,height=250,width=300');
        }

        //function to load google plus share dialog
        function showGplus() {
            var shareUrl = 'https://plus.google.com/share';
            shareUrl+= '?url='+encodeURIComponent(shareDetails.url);
            $window.open(shareUrl,'Google+ Sharer','toolbar=0,status=0,height=250,width=300');
        }

        //function to load twitter share dialog
        function showTwitter() {
            var shareUrl = 'https://twitter.com/intent/tweet?';
            shareUrl += '&text=' + encodeURIComponent(shareDetails.title);
            shareUrl += '&url=' + encodeURIComponent(shareDetails.url);
            shareUrl += '&via=' + appConfig.TWITTER_VIA;
            $window.open(shareUrl,'Twitter+ Sharer','toolbar=0,status=0,height=250,width=300');
        }
    }
})();

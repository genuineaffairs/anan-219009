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
 *  - Updated the date time input fields.
 *
 * Changes in version 1.3
 * - Replace native javascript alert with notify
 *
 * Changes in verison 1.4 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-206] Display platform and offer specific conditions
 * - [PMP-158] Fix activation date and post end date display
 *
 * Changes in 1.5 (Authentication and Social Media Integration enhancement):
 * - [PMP-246] Update share text
 *
 * Changes in 1.6 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-247] Updated share content
 *
 * @version 1.6
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('giftCardOfferCtrl', ['$scope', '$location', 'GiftCardOfferService', 'BusinessService', "LookupService", "storage", "$routeParams", "notify", 'config',
	function ($scope, $location, GiftCardOfferService, BusinessService, LookupService, storage, $routeParams, notify, config) {
            $scope.user = storage.getCurrentUserProfile();
            $scope.modal = false;
            $scope.notVerifiedModal = false;
            $scope.isVerificationFeePaidModal = false;

            LookupService.getAllBusinessTypes().then(function (types) {
                $scope.businessTypeIndex = _.indexBy(types, "id");
            }, function () {
                notify({message: "Cannot get business types", templateUrl: 'partials/module/notify-popup.html'});
            });

	    /* Get platform conditions */
	    $scope.conditions = {
		platform: '',
		custom: '',
		maxChars: config.OFFER_CONDITIONS_MAX_CHARS
	    };
	    LookupService.getPlatformGiftCardOfferConditions().then(function(result) {
		$scope.conditions.platform = result.conditions;
	    }, function() {
		notify({message: "Cannot get platform conditions", templateUrl: 'partials/module/notify-popup.html'});
	    });

            if ($scope.isFounder) {
                BusinessService.getMyBusiness().then(function (business) {
                    $scope.business = business;
                    $scope.businessAddress = business.streetAddress + ' ' + business.city + ', ' + business.state + ' ' + business.country + ' ' + business.zip;
                }, function () {
                    notify({message: "Cannot get business", templateUrl: 'partials/module/notify-popup.html'});
                });
            }

            if ($routeParams.id) {
                // get existing gift card offer
                GiftCardOfferService.getGiftCardOffer($routeParams.id).then(function (result) {
                    $scope.cardOffer = result;
                    $scope.progress = result.availableQuantity + "," + result.totalQuantity;
                    $scope.spentQuantity = result.totalQuantity - result.availableQuantity;
                    var endDateTime = moment(result.endDateTime);
                    var activationDateTime = moment(result.activationDateTime);
                    $scope.postingEnd = {
                        date: endDateTime.toDate(),
                        hours: endDateTime.format("hh"),
                        minutes: endDateTime.format("mm"),
                        am: endDateTime.format("A")
                    };
                    $scope.activation = {
                        date: activationDateTime.toDate(),
                        hours: activationDateTime.format("hh"),
                        minutes: activationDateTime.format("mm"),
                        am: activationDateTime.format("A")
                    };
		    $scope.conditions.custom = result.conditions;
                }, function () {
                    notify({message: "Cannot get gift card offer", templateUrl: 'partials/module/notify-popup.html'});
                });
            } else {
                //for new item, show always 100% progress
                $scope.progress = "1,1";
                $scope.spentQuantity = 0;
                $scope.cardOffer = {
                    status: "DRAFT"
                };
                //will keep date and time for posting end date and activation date time
                $scope.postingEnd = {
                    date: new Date(),
                    hours: '12',
                    minutes: '00',
                    am: 'AM'
                };
                $scope.activation = {
                    date: new Date(),
                    hours: '12',
                    minutes: '00',
                    am: 'AM'
                };
            }


            //close all modals
            $scope.closeModal = function () {
                $scope.isVerificationFeePaidModal = $scope.notDraftModal = $scope.postModal = $scope.saveModal = $scope.modal = $scope.notVerifiedModal = false;
            };

            /**
             * Get the share url title.
             * @returns {string} the populated title
             */
            $scope.shareUrlTitle = function () {
                return 'This is really cool. Check out ' + $scope.business.name + ' on FounderShare ';
            };

            //save offer or create new item
            //this method is called when save button is clicked and after post now is clicked
            $scope.save = function (setActive) {
                if (setActive) {
                    if (!$scope.business.isVerified) {
                        $scope.notVerifiedModal = $scope.modal = true;
                        return;
                    }
                    if (!$scope.business.isVerificationFeePaid) {
                        $scope.isVerificationFeePaidModal = $scope.modal = true;
                        return;
                    }
                }
                if ($scope.cardOffer.status !== "DRAFT") {
                    $scope.notDraftModal = $scope.modal = true;
                    return;
                }
		if ($scope.cardOffer.conditions && $scope.cardOffer.conditions.length > $scope.conditions.maxChars) {
		    return;
		}

                if ($scope.form.$invalid) {
                    return;
                }

                if (setActive) {
                    $scope.cardOffer.status = "ACTIVE";
                }
                $scope.cardOffer.discount = Number($scope.cardOffer.discount);
                $scope.cardOffer.totalQuantity = Number($scope.cardOffer.totalQuantity);
                var promise;
                if ($scope.cardOffer.id) {
                    promise = GiftCardOfferService.updateGiftCard($scope.cardOffer);
                } else {
                    promise = GiftCardOfferService.createGiftCard($scope.cardOffer);
                }
                promise.then(function (result) {
                    $scope.cardOffer.id = result.id;
                    if (setActive) {
                        $scope.postModal = $scope.modal = true;
                        $scope.shareText = "Loyal customers are what make our business successful at "+ result.businessName + ". We want to reward you for your loyalty. Check us out on foundershare.com!";
                        $scope.shareTextTw = "Shop local today and get rewarded at "+ result.businessName + ". Check us out!";
                        $scope.shareDetails = {
                            link: '' + '#/offer-details/' + result.id,
                            name: result.businessName,
                            description: result.description,
                            caption: 'FounderShare',
                            image: result.businessPicture
                        }
                    } else {
                        $scope.saveModal = $scope.modal = true;
                    }
                }, function (reason) {
                    $scope.cardOffer.status = "DRAFT";//revert status
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            //activate offer
            $scope.postNow = function () {
                $scope.save(true)
            };

            //parse date object (date, time fields) and return ISO String
            function parseDate(obj) {
                var date = moment((obj.date.getMonth() + 1) + '/' + obj.date.getDate() + '/' +  obj.date.getFullYear() + " "
                    + obj.hours + ":" + obj.minutes + " " + obj.am, "M/D/YYYY h:mm");
                return date.toISOString();
            }

            //convert user input to card offer field
            function updateEndDate() {
                if ($scope.postingEnd && $scope.postingEnd.date && $scope.postingEnd.hours && $scope.postingEnd.minutes && $scope.postingEnd.am) {
                    $scope.cardOffer.endDateTime = parseDate($scope.postingEnd);
                }
            }

            function updateActivationDate() {
                if ($scope.activation && $scope.activation.date && $scope.activation.hours && $scope.activation.minutes && $scope.activation.am) {
                    $scope.cardOffer.activationDateTime = parseDate($scope.activation);
                }
            }

            $scope.$watch("postingEnd.date", updateEndDate);
            $scope.$watch("postingEnd.hours", updateEndDate);
            $scope.$watch("postingEnd.minutes", updateEndDate);
            $scope.$watch("postingEnd.am", updateEndDate);
            $scope.$watch("activation.date", updateActivationDate);
            $scope.$watch("activation.hours", updateActivationDate);
            $scope.$watch("activation.minutes", updateActivationDate);
            $scope.$watch("activation.am", updateActivationDate);
        }]);

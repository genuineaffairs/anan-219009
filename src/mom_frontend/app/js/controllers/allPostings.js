/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * All postings controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('allPostingsCtrl', ['$scope', '$rootScope', 'GiftCardOfferService',
        function ($scope, $rootScope, GiftCardOfferService) {

            /**
             * Load all postings.
             */
            $scope.loadAllPostings = function () {
                var GiftCardOfferPromise = GiftCardOfferService.getAllGiftCardOffers;
                GiftCardOfferPromise({
                    pageNumber: 1,
                    pageSize: 99999,
                    sortBy: "modifiedOn",
                    sortOrder: "Descending"
                }).then(function (data) {
                        $scope.giftCardOffers = data.items;
                    }, function (data) {
                    });
            };

            /**
             * Popup the dialog.
             * @param id the offer id.
             */
            $scope.popup = function (id) {
                $rootScope.$broadcast("showOfferPopup", id);
            };

            $scope.$on("reloadAllPostings", function (e, offerId) {
                $scope.loadAllPostings();
            });

            $scope.loadAllPostings();
        }
    ]);
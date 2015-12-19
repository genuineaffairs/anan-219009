/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Payment controller.
 *
 * Changes in version 1.1:
 *  - Refractor the payment logic.
 *
 * Changes in version 1.2
 * - Replace native javascript alert with notify
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("paymentCtrl", ['$scope', '$timeout', '$routeParams', 'GiftCardOfferService', 'storage', '$rootScope', 'BusinessService', '$log', '$location', 'notify',
        function ($scope, $timeout, $routeParams, GiftCardOfferService, storage, $rootScope, BusinessService, $log, $location, notify) {

            var purpose = $routeParams.purpose;
            /**
             * Close modal.
             */
            $scope.closeModal = function () {
                $scope.modal = false;
            };
            GiftCardOfferService.getBraintreeToken().then(function (data) {
                braintree.setup(data.token, 'dropin', {
                    container: 'dropin-container',
                    paymentMethodNonceReceived: function (event, nonce) {
                        var profile = storage.getCurrentUserProfile();
                        profile.nonce = nonce;
                        storage.storeCurrentUserProfile(profile, false);

                        if (purpose == 'business') {
                            //some bug here, won't redirect without timeout
                            $timeout(function () {
                                $location.path('/PaymentVerification/business');
                            }, 10);
                        }
                    }
                });
            }, function (reason) {
                notify({message: 'Failed to get braintree token: ' + reason.error, templateUrl: 'partials/module/notify-popup.html'});
            });
        }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Payment verification controller.
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("paymentVerificationCtrl", ['$scope', '$location', '$routeParams', 'GiftCardOfferService', 'storage', '$rootScope', 'BusinessService', 'notify',
        function ($scope, $location, $routeParams, GiftCardOfferService, storage, $rootScope, BusinessService, notify) {
            var purpose = $routeParams.purpose;
            $scope.modal = false;
            $scope.submitted = false;
            $scope.submitFlag = false;

            var profile = storage.getCurrentUserProfile();
            $scope.individualEmail = profile.email;
            if (!profile.nonce) {
                $location.path('/Payment/business');
                return;
            }
            /**
             * Close modal.
             */
            $scope.closeModal = function () {
                $scope.modal = false;
            };

            /**
             * Submit the payment verification form.
             */
            $scope.submit = function () {
                $scope.submitted = false;
                if ($scope.submitFlag) {
                    return;
                }

                if ($scope.form.$invalid) {
                    $scope.submitted = true;
                    return;
                }

                var merchantAccountParams = {};
                merchantAccountParams.individual = {};
                merchantAccountParams.individual.address = {};
                merchantAccountParams.business = {};
                merchantAccountParams.funding = {};

                merchantAccountParams.individual.firstName = $scope.firstName;
                merchantAccountParams.individual.lastName = $scope.lastName;
                merchantAccountParams.individual.email = $scope.individualEmail;
                merchantAccountParams.individual.ssn = $scope.ssn;
                merchantAccountParams.individual.dateOfBirth = $scope.dateOfBirth;
                merchantAccountParams.individual.address.streetAddress = $scope.streetAddress;
                merchantAccountParams.individual.address.locality = $scope.locality;
                merchantAccountParams.individual.address.region = $scope.region;
                merchantAccountParams.individual.address.postalCode = $scope.postalCode;

                merchantAccountParams.business.legalName = $scope.legalName;
                merchantAccountParams.business.taxId = $scope.taxId;

                merchantAccountParams.funding.destination = 'bank';
                merchantAccountParams.funding.email = $scope.email;
                merchantAccountParams.funding.mobilePhone = $scope.mobilePhone;
                merchantAccountParams.funding.accountNumber = $scope.accountNumber;
                merchantAccountParams.funding.routingNumber = $scope.routingNumber;

                $scope.submitFlag = true;
                if (purpose == 'business') {
                    var businessId = 0;
                    for (var i = 0; i < profile.userRoles.length; i++) {
                        if (profile.userRoles[i].role === 'BUSINESS_ADMIN') {
                            businessId = profile.userRoles[i].businessId;
                        }
                    }

                    BusinessService.payForVerification(merchantAccountParams, {
                            paymentMethodNonce: profile.nonce,
                            firstName: $scope.firstName,
                            lastName: $scope.lastName
                        }
                    ).then(function () {
                            $scope.modal = true;
                        }, function (reason) {
                            $scope.submitFlag = false;
                            notify({message: 'Failed to verify: ' + reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        });
                }
            };


            if (purpose === 'business') {
                $scope.verificationName = storage.getCurrentUserProfile().firstName + ' '
                + storage.getCurrentUserProfile().lastName + ' just joined FounderShare! Have you heard of it? ';
            }


        }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for founder redeem
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 * Changes in version 1.2
 * - Automatically go to step 3 once the QR code is scanned
 * Changes in version 1.1
 * - Notify business admin or business employee if champion has less balance than purchased amount
 *
 */

(function () {
    'use strict';

    angular
        .module('app.founder.redeem')
        .controller('FounderRedeemCtrl', FounderRedeemCtrl);

    FounderRedeemCtrl.$inject = ['$scope', '$location', '$rootScope', '$modal', 'GiftCardService', 'GLOBAL_OPTIONS'];

    // Founder redeem controller
    function FounderRedeemCtrl($scope, $location, $rootScope, $modal, GiftCardService, GLOBAL_OPTIONS) {
        $scope.resetGlobal(GLOBAL_OPTIONS);

        $scope.step = 1;
        $scope.valueHolder = {};
        $scope.redeemAmount = null;
        $scope.scannedQR = null;

        // show redeem input
        $scope.goToStep2 = function () {
            if (!$scope.valueHolder.redeemAmount) {
                $scope.validateErrorMsg = 'The amount to be redeemed from the Founder$hare is invalid';
                $scope.showError = true;
            } else {
		if ($scope.userMedia) {
		    /* On Android, show the loader image when we enter
		     * step 2. The video feed from the camera is
		     * visible and the qrCode is scanned
		     * automatically. */
		    $scope.showLoader = true;
		}
		$scope.redeemAmount =
                    $scope.valueHolder.redeemAmount; $scope.step = 2;
	    }
	};

	$scope.onFileUploadClicked = function () {
	    $scope.showLoader = true;
	};

        // focus input, clear error
        $scope.focusInput = function () {
            $scope.validateErrorMsg = '';
            $scope.showError = false;
        };

	//listen if qr code failed
	$scope.$on("qrCodeFailed", function(e) {
	    //on iPhone, hide the loader until user clicks the upload
	    //button
	    if (!$scope.userMedia) {
		$scope.showLoader = false;
		$scope.$apply();
	    }
	});

        //listen if qr code is scanned
        $scope.$on("qrCode", function (e, code) {
            $scope.scannedQR = code;
	    $scope.showLoader = false;
	    // Once the QR code is scanned, automatically go to step 3
	    $scope.goToStep3();
        });

        function handleError(reason) {
            var error = reason.error;
            $rootScope.showErrorAlert(error, reason.windowClass)
                .result.then(function () {
                    $location.path("/founder-home");
                });
        }

        // Show confirm amount view
        $scope.goToStep3 = function () {
            if ($scope.scannedQR) {
                GiftCardService.getByQRCode($scope.scannedQR).then(function (result) {
                    var amount = Math.min(result.quantity, $scope.redeemAmount);
                    // check if the balance is less than the purchased amount
                    if(result.quantity < $scope.redeemAmount) {
                        $scope.balanceAmount = $scope.redeemAmount - result.quantity;
                    }
                    if (amount <= 0) {
                        handleError({
                            data: {
                                error: "Not enough quantity."
                            }
                        });
                    } else {
                        $scope.step = 3;
                        $scope.redeemAmount = amount;
                        $scope.amount = -$scope.redeemAmount;
                    }
                }, handleError);
            }
        };

        // confirm amount and deduct it
        $scope.finish = function () {
            GiftCardService.redeem($scope.scannedQR, $scope.redeemAmount).then(function () {
                var options = {
                    deducted: 'The amount (' + $scope.redeemAmount.toFixed(2) + ') has been deducted successfully!'
                };
                if($scope.balanceAmount) {
                    options.owed = 'The champion still owes ' + $scope.balanceAmount.toFixed(2);
                }
                $modal
                    .open({
                        templateUrl: 'components/modals/modal-redeem-finished.html',
                        controller: 'ModalCtrl',
                        resolve: {
                            text: function () {
                                return options;
                            }
                        }
                    })
                    .result.then(function () {
                        $location.path("/founder-home");
                    });
            }, handleError);
        };

    }
})();

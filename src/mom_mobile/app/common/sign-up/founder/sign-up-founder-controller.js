/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definitions for founder sign up page
 *
 * Changes in 1.1 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Implemented add business to existing champion account
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.common.signUp')
        .controller('SignUpFounderCtrl', SignUpFounderCtrl);

    SignUpFounderCtrl.$inject = ['$scope', '$location', '$rootScope', '$log', 'LookupService', '$modal',
        'SignUpService', 'GLOBAL_OPTIONS', 'UserService', 'StorageService'];


    //sign up founder Controller
    function SignUpFounderCtrl($scope, $location, $rootScope, $log, LookupService, $modal,
                               SignUpService, GLOBAL_OPTIONS, UserService, StorageService) {
        $scope.resetGlobal(GLOBAL_OPTIONS);
        $scope.businessTypes = [];
        LookupService.getAllBusinessTypes().then(function (types) {
            $scope.businessTypes = types;
        }, function (reason) {
            $log.error('Error fetching business types HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
        });
        $scope.requiredFields = {
        };
        // reset modal
        SignUpService.signUpUtil($scope, $location, $rootScope, $log, $modal);
        $scope.register = $scope.validateUtil;
        if($rootScope.loggedUser && $rootScope.loggedUser.userRoles.length === 1 && $rootScope.isUser) {
            $scope.isAddBusiness = true;
            $scope.userFirstName = $rootScope.loggedUser.firstName;
            $scope.userLastName = $rootScope.loggedUser.lastName;
            $scope.mail = $rootScope.loggedUser.email;
            $scope.password = 1234567890;
        }

        $scope.addBusiness = function () {
            if(!$scope.isAcceptTerms || !$scope.signUpForm.$valid) {
                return;
            }
            var business = {
                name: $scope.bizName,
                type: Number($scope.businessType)
            };
            var businessImage = document.getElementById('uploadBtn').files[0];
            if (businessImage && businessImage.size > appConfig.MAX_IMAGE_SIZE) {
                ModalService.showModal('id027');
                ModalService.currentMessage.msgText = 'The image must be less than 800Kb';
                return;
            }
            UserService.addBusiness(business, businessImage).then(function () {
                $rootScope.loginHandler(StorageService.getSessionToken(), false, function () {
                    $rootScope.showInformation('Business account added successfully!').result.then(function () {
                        $location.path('/founder-home');
                    });
                });

            }).catch(function (err) {
                $rootScope.showInformation(err.error);
            });
        };

    }
})();
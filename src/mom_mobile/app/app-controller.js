/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller definition for root application
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included new global options showMenu, cancel and showShare
 *  - Included clearing of modals while global resets.
 *  - Removed removal of menu when user logs off.
 *
 * Changes in 1.2
 *  - Included new navigation options to close the window or start navigation
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppCtrl', AppCtrl);

    AppCtrl.$inject = ['$rootScope', '$scope', '$modal', '$location', 'ModalService'];

    // Global page controller
    function AppCtrl($rootScope, $scope, $modal, $location, ModalService) {
        document.body.setAttribute('ontouchstart', '');
        $scope.global = {
            title: 'Founder Share',
            headless: true
        };
        $scope.userRoles = {
            BUSINESS_ADMIN: 'BUSINESS_ADMIN',
            INDIVIDUAL_USER: 'INDIVIDUAL_USER',
            BUSINESS_EMPLOYEE: 'BUSINESS_EMPLOYEE'
        };
        $scope.vm = ModalService;
        $scope.resetGlobal = function (options) {
            $scope.vm.clearModal();
            options = options || {};
            $scope.global.headless = options.headless || false;
            $scope.global.showHeader = !$scope.global.headless;
            $scope.global.back = options.back || '';
            $scope.global.cancel = options.cancel || '';
            $scope.global.menuOpened = false;
            if (options.title) {
                $scope.global.title = options.title;
            }
            $scope.global.showShare = options.showShare || false;
            $scope.global.showMenu = options.showMenu || false;
            $scope.global.close = options.close || false;
            $scope.global.start = options.start || false;

            dismissModal();
        };


        var modalInstance = null;

        function dismissModal() {
            if (modalInstance) {
                modalInstance.dismiss();
            }
        }

        $rootScope.showInformation = function (text) {
            dismissModal();
            modalInstance = $modal.open({
                templateUrl: 'components/modals/modal.html',
                controller: 'ModalCtrl',
                resolve: {
                    text: function () {
                        return text;
                    }
                }
            });
            modalInstance.result.then(function () {
                modalInstance = null;
            }, function () {
                modalInstance = null;
            });
            return modalInstance;
        };

        $rootScope.showConfirmation = function (text) {
            dismissModal();
            modalInstance = $modal.open({
                templateUrl: 'components/modals/modal-confirm.html',
                controller: 'ModalCtrl',
                resolve: {
                    text: function () {
                        return text;
                    }
                }
            });
            modalInstance.result.then(function () {
                modalInstance = null;
            }, function () {
                modalInstance = null;
            });
            return modalInstance;
        };

        //closes the current window
        $scope.windowClose = function() {
            window.close();
        };

        // reset modal
        $scope.cancelRedeem = function () {
            $rootScope.showConfirmation('Are you sure you want to cancel this process?')
                .result.then(function () {
                    $location.path('/founder-home');
                });
        };

        // fix for safari mobile height 100% issue.
        // First check to see if the platform is an iPhone or iPod
        if (/iP/.test(navigator.platform) && /Safari/i.test(navigator.userAgent)) {
            var mobileSafari = 'Safari';
        }

        // Set the div height
        function setHeight($rightSidebar) {
            var new_height = $(this).height();
            // if mobileSafari add +60px
            if (typeof mobileSafari === 'string') {
                new_height += 60
            }
            $rightSidebar.css('height', new_height);
        }

        setHeight($('body'));
        $(window).resize(function () {
            setHeight.call(this, $('body'));
        });

        $rootScope.$watch('loggedIn', function (value) {
            $rootScope.$broadcast('authScopeChanged');
        }, true);
    }
})();
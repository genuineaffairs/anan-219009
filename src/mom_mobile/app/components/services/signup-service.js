/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents services.
 *
 * @version 1.6
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1
 * - Remove confirm password for registration
 *
 * Changes in version 1.2
 * - Redirect to home page after successful signup
 *
 * Changes in version 1.3 (Project Mom and Pop - MiscUpdate5):
 * - Use a modal to display error message instead of alert
 *
 * Changes in version 1.4 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-220] Add subscribedToNews field
 * - Check image file size
 *
 *  Changes in 1.5 (Authentication and Social Media Integration enhancement):
 * - [PMP-242] Auto connect user
 *
 * Changes in 1.6 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Added method goToLogin
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('SignUpService', SignUpService);

    SignUpService.$inject = ['UserService', 'SecurityService', 'Base64Service', 'ModalService','appConfig'];

    function SignUpService(UserService, SecurityService, Base64Service, ModalService, appConfig) {
        var service = {};

        /**
         * Add check confirm password function to $scope
         * @param $scope  $scope have password and confirmPassword to be checked.
         */

        service.checkConfirmPassword = function ($scope) {
            // check  confirm password matches password
            $scope.checkConfirmPassword = function () {
                return $scope.password === $scope.confirmPassword &&
                    ($scope.password !== undefined )
                    && ($scope.confirmPassword !== undefined )
                    && ( $scope.password.length > 0 && $scope.confirmPassword.length > 0 );
            };
        };

        // common methods of sign up champion controller and sign up founder controller
        service.signUpUtil = function ($scope, $location, $rootScope, $log, $modal) {
            $scope.accountTypes = {
                champion: 'CHAMPION',
                founder: 'FOUNDER'
            };
            var socialNetworks = $scope.socialNetworks = {
                facebook: 'FACEBOOK',
                twitter: 'TWITTER',
                linkedin: 'LINKEDIN'
            };

            $scope.passwordLen = appConfig.PASSWORD_LENGTH + 1;
            $scope.isSubscribeNewsletter = true;

            $scope.isElementInvalid = function(element) {
                return element.$touched && element.$invalid;
            };

            // toggle accept terms and conditions
            $scope.toggleAcceptTerms = function () {
                $scope.isAcceptTerms = !$scope.isAcceptTerms;
            };

            // toggle subscribe newsletter
            $scope.toggleSubscribeNewsletter = function() {
                $scope.isSubscribeNewsletter = !$scope.isSubscribeNewsletter;
            };

            // set upload browser button and upload file text field.
            document.getElementById('uploadBtn').onchange = function () {
                document.getElementById('uploadFile').value = this.value;
                var path = this.value;
                // just show file name
                var fileName = path.replace(/.*\\/, '');
                fileName = fileName.replace(/.*\//, '');
                document.getElementById('uploadFile').value = fileName;
            };

            // return whether accept term is checked and .
            $scope.isAcceptTermUnCheck = function () {
                return !$scope.isAcceptTerms;
            };


            service.checkConfirmPassword($scope);
            // return whether  disable register button.
            $scope.isDisableRegister = function () {
                var flag = !$scope.isAcceptTerms || $scope.signUpForm.$invalid;
                if($scope.signUpForm.confirmPassword) {
                    flag = flag || !$scope.checkConfirmPassword();
                }
                return flag;
            };
            $scope.goToLogin = function () {
                $rootScope.tmp.redirectUrl = '/sign-up-founder';
                $location.path("/login");
            };

            var registerHelper = function (registration, userImage, businessImage) {
                if (userImage && userImage.size > appConfig.MAX_IMAGE_SIZE) {
                    ModalService.showModal('id027');
                    ModalService.currentMessage.msgText = 'The image must be less than 800Kb';
                    return;
                }

                if (businessImage && businessImage.size > appConfig.MAX_IMAGE_SIZE) {
                    ModalService.showModal('id027');
                    ModalService.currentMessage.msgText = 'The image must be less than 800Kb';
                    return;
                }
                UserService.register(registration, userImage, businessImage).then(function (result) {
                    if (result.autoConnect) {
                        $rootScope.loginHandler(result.sessionToken, true);
                    } else {
                        $log.info('registration success');
                        $rootScope.showInformation('You have successfully registered. Please check your e-mails for the confirmation message and follow its instructions.').result.then(function () {
                            $location.path('/home');
                        });
                    }
                }, function (reason) {
                    if(reason.error === 'This email address is already registered with champion account.') {
                        $rootScope.tmp.email = registration.email;
                        $rootScope.showConfirmation(reason.error + ' Do you want to sgn up as Business Owner?').result.then($scope.goToLogin);
                        return;
                    }
                    ModalService.showModal('id027');
                    ModalService.currentMessage.msgText = 'Your sign up request could not be completed. ' + reason.error;
                });
            };

            $scope.checkPassword = function () {
                if ($scope.signUpForm.confirmPassword) {
                    $scope.signUpForm.confirmPassword.$setValidity('noMatch', $scope.checkConfirmPassword());
                }
                $scope.signUpForm.password.$setValidity('badContent', SecurityService.checkPasswordContent($scope.signUpForm.password.$viewValue));
            };

            // tool function for validate form data
            $scope.validateUtil = function (type) {
                $scope.validateErrorMsg = '';


                $scope.afterClickRegister = true;
                // if  validate pass, alert message and redirect to login page.
                var registration, userImage, businessImage;
                if ($scope.signUpForm.$valid && !$scope.showError) {
                    var password = $scope.confirmPassword || $scope.password;
                    if (type === $scope.accountTypes.champion) {
                        userImage = document.getElementById('uploadBtn').files[0];
                        registration = {
                            firstName: $scope.firstName,
                            lastName: $scope.lastName,
                            password: password,
                            accountType: type,
                            email: $scope.mail,
                            subscribedToNews: $scope.isSubscribeNewsletter
                        };

                    } else if (type === $scope.accountTypes.founder) {
                        businessImage = document.getElementById('uploadBtn').files[0];
                        registration = {
                            firstName: $scope.userFirstName,
                            lastName: $scope.userLastName,
                            password: password,
                            accountType: type,
                            email: $scope.mail,
                            subscribedToNews: $scope.isSubscribeNewsletter,
                            business: {
                                name: $scope.bizName,
                                type: Number($scope.businessType)
                            }
                        };
                    }
                    registerHelper(registration, userImage, businessImage);
                }
            };


            $scope.registerWithSocialNetwork = function (socialNetwork, type) {
                if (socialNetwork === socialNetworks.facebook) {
                    OAuth.popup('facebook').done(function (result) {
                        var registration = {
                            linkedSocialNetwork: socialNetwork,
                            linkedSocialNetworkAccessToken: result.access_token,
                            accountType: type
                        };
                        registerHelper(registration);
                    }).fail(function (err) {
                        $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                    });
                } else if (socialNetwork === socialNetworks.linkedin) {
                    OAuth.popup('linkedin2').done(function (result) {
                        var registration = {
                            linkedSocialNetwork: socialNetwork,
                            linkedSocialNetworkAccessToken: result.access_token,
                            accountType: type
                        };
                        registerHelper(registration);
                    }).fail(function (err) {
                        $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                    });
                } else if (socialNetwork === socialNetworks.twitter) {
                    OAuth.popup('twitter').done(function (result) {
                        var token = Base64Service.encode(result.oauth_token + ':' + result.oauth_token_secret);
                        var registration = {
                            linkedSocialNetwork: socialNetwork,
                            linkedSocialNetworkAccessToken: token,
                            accountType: type
                        };
                        $modal.open({
                            templateUrl: '../modals/modal-complete-registration.html',
                            controller: 'ModalCompleteSignUpCtrl'
                        }).result.then(function (email) {
                            registration.email = email;
                            registerHelper(registration);
                        });
                    }).fail(function (err) {
                        $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                    });
                }
            };

            $scope.afterClickRegister = false;

            var orgTitle = $scope.global.title;
            //show terms and conditions and hide registration form
            $scope.showTerms = function () {
                $scope.isTermsMode = true;
                $scope.global.title = 'Terms & Conditions';
                $scope.global.headless = false;
            };

            //show registration form
            $scope.hideTerms = function () {
                $scope.isTermsMode = false;
                $scope.global.title = orgTitle;
                $scope.global.headless = true;
            }
        };

        return service;
    }

})();



/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Profile controller.
 *
 * Changes in version 1.1:
 *  - Refractor the user role related code.
 *
 * Changes in version 1.2:
 *  - Updated the password validation logic.
 *
 * Changes in version 1.3
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.4
 * - Provision to edit last name, password for newly added platform admin
 *
 * Changes in version 1.5 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-210] Fix change password
 *
 * Changes in version 1.6 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-220] Add subscribedToNews field
 * - [PMP-217] Disable save button while submitting
 * - Check for image file size
 *
 * Changes in 1.7 (Authentication and Social Media Integration enhancement):
 * - [PMP-242] Add functionality to connect and disconnect from social networks
 * - [PMP-246] Add autoshare option
 *
 * Changes in 1.8 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Refactored the code to improve readability
 * - [PMP-237] Update Profile logic is improved to include champion.
 *
 * @version 1.8
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("profileCtrl", ['$scope', "$rootScope", 'SecurityService', '$location', 'storage', 'BusinessService',
        'LookupService', 'UserService', '$log', 'config', 'util', 'notify', 'ChampionService',
        function ($scope, $rootScope, SecurityService, $location, storage, BusinessService,
                  LookupService, UserService, $log, config, util, notify, ChampionService) {

            $scope.password = {
                switchPassword: false,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
            $scope.user = storage.getCurrentUserProfile();
            $scope.Edit = false;
            $scope.submitted = false;
            $scope.submitting = false;
            $scope.infoEdit = false;
            $scope.edit = false;

            $scope.cancelPassword = cancelPassword;
            $scope.savePassword = savePassword;
            $scope.isInValidString = isInValidString;
            $scope.showEditInfo = showEditInfo;
            $scope.saveInfo = saveInfo;
            $scope.cancelInfo = cancelInfo;
            $scope.saveBusiness = saveBusiness;
            $scope.editBusiness = editBusiness;
            $scope.cancelBusiness = cancelBusiness;
            $scope.showContactInformation = showContactInformation;
            $scope.savePlatformAdminInfo = savePlatformAdminInfo;
            $scope.checkHasConnection = checkHasConnection;
            $scope.toggleConnection = toggleConnection;
            $scope.autoShareChanged = autoShareChanged;

            activate ();
            function activate () {
                if ($rootScope.isFounder) {
                    LookupService.getAllBusinessTypes().then(function (result) {
                        $scope.allBusinessTypes = result;
                        $scope.allBusinessTypesIndex = _.indexBy(result, 'id');

                        BusinessService.getMyBusiness().then(function (result) {
                            result.type = $scope.allBusinessTypesIndex[result.type];
                            $scope.businessRI = result;
                            if (!$scope.businessRI.type) {
                                $scope.businessRI.type = {};
                            }
                            $scope.businessEI = angular.copy(result);
                        })
                    });
                }
                if ($scope.isUser) {
                    ChampionService.getMyChampionProfile().then(function (result) {
                        $scope.championRI = result;
                        $scope.championEI = angular.copy(result);
                    })
                }
                UserService.getMyUserProfile().then(function (data) {
                    $scope.profileInfo = data;
                    $scope.profileEditInfo = {};
                    if (!$scope.profileInfo.location) {
                        $scope.profileInfo.location = undefined;
                    }
                    angular.copy($scope.profileInfo, $scope.profileEditInfo);

                }, function (reason) {
                    $log.log(reason);
                    notify({message: reason, templateUrl: 'partials/module/notify-popup.html'});
                });
            }
            /**
             * Cancel password edit.
             */
            function cancelPassword () {
                $scope.password.newPassword = '';
                $scope.password.confirmPassword = '';
                $scope.password.switchPassword = false;
                $scope.submitted = false;
                $scope.submitting = false;
            }

            /**
             * Save the password.
             */
            function savePassword () {
                $scope.submitted = false;
                if ($scope.password.currentPassword === '' ||
                    $scope.password.newPassword === '' ||
                    $scope.password.confirmPassword === '') {
                    $scope.submitted = true;
                    return;
                }
                if ($scope.password.newPassword !== $scope.password.confirmPassword) {
                    $scope.submitted = true;
                    return;
                }

                if (SecurityService.checkPasswordLength($scope.password.newPassword)) {
                    notify({message: 'The password must have 8 chars at least.', templateUrl: 'partials/module/notify-popup.html'});
                    return;
                }
                if (!(SecurityService.checkPasswordContent($scope.password.newPassword))) {
                    notify({message: 'The password must contain both numbers and chars.', templateUrl: 'partials/module/notify-popup.html'});
                    return;
                }
                SecurityService.authenticate($scope.user.email, $scope.password.currentPassword).then(function (data) {

                    storage.storeSessionToken(data.sessionToken, false);

                    SecurityService.resetPassword($scope.password.newPassword).then(function (data) {
                        $scope.password.switchPassword = false;
                        $scope.password.currentPassword = '';
                        $scope.password.newPassword = $scope.password.confirmPassword = "";
                    }, function (reason) {
                        notify({message: "Failed to reset password.", templateUrl: 'partials/module/notify-popup.html'});
                        $log.log(reason);
                    });
                }, function (reason) {
                    notify({message: "The password is incorrect.", templateUrl: 'partials/module/notify-popup.html'});
                    $log.log(reason);
                });

            }

            function isInValidString (value) {
                if (!value || value.trim() === '') {
                    return true;
                }
                return false;
            }


            /**
             * Show the update user info fields.
             */
            function showEditInfo () {
                $scope.infoEdit = !$scope.infoEdit;
            }
            /**
             * Save the info.
             * @param flows the upload file
             * @param form the html form
             */
            function saveInfo (flows, form) {
                if ($scope.submitting) {
                    return;
                }
                $scope.submitted = false;
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                $scope.submitting = true;
                if (flows && flows.length > 0) {
                    var image = flows[0].file;
                    if (image.size > config.MAX_IMAGE_SIZE) {
                        // Check if the image size is greater than max size
                        notify({message: 'The image must be less than 800Kb', templateUrl: 'partials/module/notify-popup.html'});
                        $scope.submitting = false;
                        return;
                    }
                }
                UserService.updateMyUserProfile($scope.profileEditInfo, image).then(function (data) {
                    angular.copy(data, $scope.profileInfo);
                    if($rootScope.isUser) {
                        _submitChampion(image);
                    }
                }, function (reason) {
                    $scope.submitting = false;
                    $log.log(reason);
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            }

            /**
             * Cancel the info edit.
             */
            function cancelInfo () {
                $scope.submitted = false;
                $scope.infoEdit = false;
                angular.copy($scope.profileInfo, $scope.profileEditInfo);
            }

            /**
             * Save business info.
             * @param flows the upload file
             * @param form the html form
             */
            function saveBusiness (flows, form) {
                if ($scope.submitting) {
                    return;
                }
                $scope.submitted = false;
                if (form.$invalid || !$scope.businessEI.type.id) {
                    $scope.submitted = true;
                    return;
                }
                var image;
                if (flows && flows.length > 0) {
                    image = flows[0].file;
                } else if (!$scope.businessRI.picture) {
                    $scope.submitted = true;
                    return;
                }
                _submitBusiness(image);
            }


            /**
             * Save business profile
             * @param image the business logo
             */
            function _submitBusiness (image) {
                var tmp = {};
                angular.copy($scope.businessEI, tmp);
                tmp.type = $scope.businessEI.type.id + '';
                $scope.submitting = true;
                UserService.updateMyUserProfile({
                    subscribedToNews: $scope.profileEditInfo.subscribedToNews,
                    autoShare: $scope.profileEditInfo.autoShare
                }).then(function (data) {
                    BusinessService.updateMyBusinessProfile(tmp, image).then(function (data) {
                        $scope.submitting = false;
                        angular.copy($scope.businessEI, $scope.businessRI);
                        $scope.edit = false;
                        $rootScope.loggedUser.business = data;
                        util.refreshUser();
                    }, function (reason) {
                            $scope.submitting = false;
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        $log.log(reason);
                    });
                });
            }

            /**
             * Save Champion profile
             * @param image the champion logo
             */
            function _submitChampion (image) {
                ChampionService.updateMyChampionProfile($scope.championEI, image).then(function (data) {
                    $scope.championEI = data;
                    angular.copy($scope.championEI, $scope.championRI);
                    $scope.submitting = false;
                    $scope.infoEdit = false;
                    util.refreshUser();
                }, function (reason) {
                    $scope.submitting = false;
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                    $log.log(reason);
                });
            }

            /**
             * Edit business fields.
             */
            function editBusiness () {
                $scope.edit = !$scope.edit;
            }

            /**
             * Cancel the business edit.
             */
            function cancelBusiness () {
                angular.copy($scope.businessRI, $scope.businessEI);
                $scope.edit = false;
            }

            function showContactInformation () {
                return $scope.isPlatformAdmin && !$scope.user.lastName;
            };

            function savePlatformAdminInfo (platformAdminInfo) {
                UserService.updatePlatformAdmin(platformAdminInfo).then(function() {
                    notify({message: 'Updated successfully! Kindly login again.', templateUrl: 'partials/module/notify-popup.html'});
                    storage.clear();
                    $location.path('/Login');
                }, function(reason) {
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            /**
             * Check if user is connection to given social network
             * @param type social network type
             */
            function checkHasConnection (type) {
                if (!$scope.profileInfo) {
                    return false;
                }
                var connection = _.findWhere($scope.profileInfo.linkedSocialNetworks, {"socialNetwork": type});
                return !!connection;
            };

            /**
             * Toggle social network connection
             * @param type the social network type
             */
            function toggleConnection (type) {
                if (!$scope.profileInfo) {
                    return;
                }
                var hasConnection = $scope.checkHasConnection(type);
                if (hasConnection) {
                    if($scope.isUser && $scope.championEI.autoShare && (!$scope.profileInfo.linkedSocialNetworks
                        || $scope.profileInfo.linkedSocialNetworks.length < 2)) {
                        notify({
                            message: "There is no Social Media connected for auto-sharing.",
                            templateUrl: 'partials/module/notify-popup.html'
                        });
                    }
                    UserService.removeSocialConnection(type).then(function () {
                        $scope.profileInfo.linkedSocialNetworks = _.filter($scope.profileInfo.linkedSocialNetworks, function (connection) {
                            return connection.socialNetwork !== type;
                        });
                        util.refreshUser();
                    }, function (reason) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                    });
                } else {
                    util.connectToSocialNetwork(type).then(function () {
                        $scope.profileInfo.linkedSocialNetworks.push({
                            socialNetwork: type
                        });
                        util.refreshUser();
                    });
                }
            }

            function autoShareChanged () {
                if($scope.championEI.autoShare && (!$scope.profileInfo.linkedSocialNetworks
                    || !$scope.profileInfo.linkedSocialNetworks.length)) {
                    notify({
                        message: "There is no Social Media connected for auto-sharing.",
                        templateUrl: 'partials/module/notify-popup.html'
                    });
                }

            }
        }]);

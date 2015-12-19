/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents angular directives
 *
 * Changes in version 1.1 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] AutoShare flag moved to champion schema
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .directive('momAutoShare', momAutoShare)
        .directive('momFireAutoShare', momFireAutoShare);

    momAutoShare.$inject = ['SharingService', 'StorageService', '$rootScope', 'UtilService', '$window', '$location'];

    //auto share text to social media
    function momAutoShare(SharingService, StorageService, $rootScope, UtilService, $window, $location) {
        return {
            scope: {
                shareCategory: "=shareCategory",
                shareText: "=shareText",
                shareTextTw: "=shareTextTw"
            },
            templateUrl: "components/directives/auto-share-icons.html",
            link: function (scope) {
                scope.$on('fireShare', function () {
                    _.each(scope.active, function (val, type) {
                        var content = {};
                        content.message = type == "TWITTER" ? scope.shareTextTw : scope.shareText;
                        SharingService.share(type, content)
                    });
                });
                
                if ($rootScope.loggedUser) {
                    init($rootScope.loggedUser);
                } else {
                    scope.$watch(function () {
                        return $rootScope.loggedUser;
                    }, function (user) {
                        if (user) {
                            init(user);
                        }
                    });
                }

                //set up plugin if user is logged id
                function init(user) {
                    scope.active = {};
                    if (user.champion.autoShare) {
                        _.each(user.linkedSocialNetworks, function (network) {
                            scope.active[network.socialNetwork] = true;
                        });
                    }
                    scope.shareGoogle = function () {
                        var urlhead = 'http://rest.sharethis.com/v1/share/share?destination=googleplus';
                        var pageUrl = $location.absUrl().split("#")[0];
                        var urlparm = '&url=' + window.encodeURIComponent(pageUrl);
                        $window.open(urlhead + urlparm, 'sharer', "toolbar=0,status=0,height=500,width=600");
                    };
                    //toggle button press
                    scope.toggle = function (type) {
                        if (scope.active[type]) {
                            delete scope.active[type];
                            return;
                        }
                        var connection = _.findWhere(user.linkedSocialNetworks, {"socialNetwork": type});
                        if (connection) {
                            scope.active[type] = true;
                        } else {
                            UtilService.connectToSocialNetwork(type).then(function () {
                                scope.active[type] = true;
                                user.linkedSocialNetworks.push({
                                    socialNetwork: type
                                });
                                StorageService.storeCurrentUserProfile(user, true);
                            });
                        }
                    };
                }
            }
        };
    }

    momFireAutoShare.$inject = ["$rootScope"];
    
    //on click send event to momAutoShare directive
    function momFireAutoShare($rootScope) {
        return {
            link: function (scope, el) {
                el.click(function () {
                    $rootScope.$broadcast("fireShare");
                });
            }
        };
    }
})();

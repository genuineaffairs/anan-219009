/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for history page for champion and admin
 *
 * Changes in verion 1.1
 * - Add sorting while fetching history
 *
 * Changes in version 1.2 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - Resolve the user role
 *
 * Changes in version 1.3 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Roles are checked in more consistent way
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 */

(function () {
    'use strict';

    angular
        .module('app.common.history', [
            'ngRoute',
            'infinite-scroll',
            'app.components'
        ])
        .config(config);

    config.$inject = ['$routeProvider'];

    //config route for champion and admin history page
    function config($routeProvider) {
        $routeProvider
            .when('/champion-history', {
                templateUrl: 'common/history/history.html',
                controller: 'HistoryCtrl',
                isPublic: true,
                resolve: {
                    pageData: ChampionHistoryResolve,
                    pageRole: RoleResolve,
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'My History',
                            showMenu: true,
                            back: 'home'
                        }
                    }
                }
            })
            .when('/business-history',{
                templateUrl: 'common/history/history.html',
                controller: "HistoryCtrl",
                resolve: {
                    pageData: FounderHistoryResolve,
                    pageRole: function() {
                        return 'admin';
                    },
                    GLOBAL_OPTIONS: function () {
                        return {
                            headless: false,
                            title: 'My History',
                            showMenu: true,
                            back: 'founder-home'
                        }
                    }
                }
            })
    }

    ChampionHistoryResolve.$inject = ['UserService', 'appConfig'];
    //get all the relevant data for champion history page and inject into the controller
    function ChampionHistoryResolve(UserService, appConfig) {
        var params = {
            pageNumber: 1,
            pageSize: appConfig.HISTORY_ITEMS_PER_PAGE * appConfig.HISTORY_HOME_PAGES,
            sortOrder: 'Descending',
            sortBy: 'timestamp'
        };
        return UserService.getMyActions(params);
    }

    RoleResolve.$inject = ['UtilService', '$rootScope'];
    function RoleResolve(UtilService, $rootScope) {
	if ($rootScope.isUser) {
            return 'champion';
	}
	if (UtilService.getUserRoles(UtilService.BUSINESS_ADMIN)) {
            return 'business-admin';
	}
	if (UtilService.getUserRoles(UtilService.BUSINESS_EMPLOYEE)) {
            return 'business-employee';
	}
	return 'other';
    }

    FounderHistoryResolve.$inject = ['BusinessService', 'appConfig'];
    //get all the relevant data for admin history page and inject into the controller
    function FounderHistoryResolve (BusinessService, appConfig) {
        var params = {
            pageNumber: 1,
            pageSize: appConfig.HISTORY_ITEMS_PER_PAGE * appConfig.HISTORY_HOME_PAGES,
            sortOrder: 'Descending',
            sortBy: 'timestamp'
        };
        return BusinessService.getMyBusinessActions(params);
    }
})();


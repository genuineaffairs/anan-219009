/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route and controller definitions for static pages like terms of service and privacy
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included terms, faq and how it works page.
 *  - Included option to inject page data if any
 */

(function () {
    'use strict';

    angular
        .module('app.common.static', [
            'ngRoute',
            'ngSanitize'
        ])
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/privacy', {
                templateUrl: 'common/static/privacy.html',
                controller: 'StaticCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            title: 'Privacy Policy',
                            showMenu: true
                        }
                    },
                    DATA: function () {
                        return {}
                    }
                }
            })
            .when('/terms', {
                templateUrl: 'common/static/terms.html',
                controller: 'StaticCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            title: 'Terms & Conditions',
                            showMenu: true
                        }
                    },
                    DATA: function () {
                        return {}
                    }
                }
            })
            .when('/how-it-works', {
                templateUrl: 'common/static/how-it-works.html',
                controller: 'StaticCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            title: 'How It Works',
                            showMenu: true
                        }
                    },
                    DATA: ['UtilService', function(UtilService){
                        return UtilService.getHowItWorks();
                    }]
                }
            })
            .when('/faq', {
                templateUrl: 'common/static/faq.html',
                controller: 'StaticCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            title: 'Frequently Ask Questions',
                            showMenu: true
                        }
                    },
                    DATA: ['UtilService', function(UtilService){
                        return UtilService.getFAQ();
                    }]
                }
            });
    }
})();

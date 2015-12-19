/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for report abuse page
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Change name from abuse to contact support
 *  - Included global options showMenu
 */

(function () {
    'use strict';

    angular
        .module('app.common.contactSupport', [
            'ngRoute',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/contact-support', {
                templateUrl: 'common/contact-support/contact-support.html',
                controller: 'ContactSupportCtrl',
                isPublic: true,
                resolve: {
                    GLOBAL_OPTIONS: function () {
                        return {
                            title: 'Contact Support',
                            back: 'home',
                            showMenu: true
                        }
                    }
                }
            })
    }

})();


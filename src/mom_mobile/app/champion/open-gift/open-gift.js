/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module and route definitions for opening a gift received
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Chang file name from gift to open-gift
 */

(function () {
    'use strict';

    angular
        .module('app.champion.openGift', [
            'ngRoute',
            'app.components'
        ])
        .config(config);


    config.$inject = ['$routeProvider'];

    //open gift route config
    function config($routeProvider) {
        $routeProvider
            .when("/Gift/:code", {
                templateUrl: "champion/open-gift/open-gift.html",
                controller: 'OpenGiftCtrl',
                isPublic: true
            });
    }

})();


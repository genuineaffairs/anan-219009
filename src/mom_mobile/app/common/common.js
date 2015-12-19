/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module definition for public and common pages / controllers for founder and champion like
 * login, sign up, menu
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included the offers and offer details as additional dependency
 *  - Changed the name from abuse to contact support.
 *
 * Changes in 1.2
 *  - Consolidated the history page for champion and founder and included it in common module.
 */

(function () {
    'use strict';

    angular.module('app.common', [
        'app.common.contactSupport',
        'app.common.history',
        'app.common.login',
        'app.common.menu',
        'app.common.resetPassword',
        'app.common.signUp',
        'app.common.static',
        'app.common.offers',
        'app.common.offerDetails'
    ])
})();


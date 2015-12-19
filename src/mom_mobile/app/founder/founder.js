/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module definition for founder specific pages / controllers like
 * founder home, founder history and founder redeem
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Removed the founder history page for app.founder module and moved it to app.common module
 */

(function () {
    'use strict';

    angular.module('app.founder', [
        'app.founder.home',
        'app.founder.redeem'
    ])
})();


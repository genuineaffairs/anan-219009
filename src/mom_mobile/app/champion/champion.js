/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular module definition for champion specific pages / controllers like
 * champion home, champion history and champion redeem
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included dependencies for new functions like gifting, my cart and payment
 *  - Modified the dependency home to founderShares
 *
 *  Changes in 1.2
 *  - Included giftCardDetails and showRoute modules
 */

(function () {
    'use strict';

    angular.module('app.champion', [
        'app.champion.openGift',
        'app.champion.founderShares',
        'app.champion.giftCardDetails',
        'app.champion.showRoute',
        'app.champion.redeem',
        'app.champion.sendGift',
        'app.champion.myCart',
        'app.champion.payment'
    ])
})();


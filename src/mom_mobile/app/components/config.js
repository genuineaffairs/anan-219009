/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular constants for the app
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included FB_APP_ID, TWITTER_VIA, MAX_QUANTITY, OFFERS_PER_PAGE, OFFERS_HOME_PAGE
 *
 * Changes in 1.2
 *  - Included HISTORY_ITEMS_PER_PAGE and HISTORY_HOME_PAGES
 *
 * Changes in 1.3:
 *  - Added MAX_IMAGE_SIZE
 *  - Added MIN_BUY_NOW_VALUE
 */

var GOOGLE_ANALYTICS = "UA-57785814-1";  // Prod env Id
// var GOOGLE_ANALYTICS = "UA-57785814-2";  // QA env Id

(function () {
    'use strict';

    angular
        .module('app.components')
        .constant('appConfig', {
            REST_SERVICE_BASE_URL : 'http://local.foundershare.com:3000',
            OAUTH_PUBLIC_KEY: 'C3ds4WNvZeQTod-fqBg-sPUf2WQ',
            FB_APP_ID: '<<update>>',
            TWITTER_VIA: 'FounderShare',
            PASSWORD_LENGTH: 7,
            MAX_QUANTITY: 2000,
            OFFERS_PER_PAGE: 8,
            OFFERS_HOME_PAGES: 2,
            HISTORY_ITEMS_PER_PAGE: 10,
            HISTORY_HOME_PAGES: 2,

            //use this to show only a file input for QR code (not camera)
            //useful to test in non-mobile devices
            FORCE_QR_FILE_UPLOAD: false,

	    /* TEMPORARY: [PMP-178] Used to set default value for buy now
	     * function */
	    DEFAULT_BUY_NOW_VALUE: 100,
	    MIN_BUY_NOW_VALUE: 10,
	    MAX_IMAGE_SIZE: 819200 // 800Kb
        })
})();


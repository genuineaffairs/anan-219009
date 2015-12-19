/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application configuration.
 *
 * Changes in version 1.1:
 *  - Added wordpress related configuration items.
 *
 * Changes in version 1.2:
 *  - Added LOAD_MORE_ITEM_COUNT configuration item.
 * 
 * Changes in version 1.3:
 * - Remove SESSION_TOKEN_REFRESH_PERIOD
 * - Fix WP pages (use production links)
 *
 * Changes in version 1.4 (Project Mom and Pop - MiscUpdate5):
 * - Add OFFER_CONDITIONS_MAX_CHARS
 *
 * Changes in version 1.5 (Project Mom and Pop - Release Fall 2015):
 * - Add MAX_IMAGE_SIZE
 * - Add MIN_BUY_NOW_VALUE
 *
 * @version 1.5
 * @author TCSASSEMBLER
 */

var GOOGLE_ANALYTICS = "UA-57785814-1";  // Prod env Id
// var GOOGLE_ANALYTICS = "UA-57785814-2";  // QA env Id

angular.module("app")
    .constant('config', _.extend({
        REST_SERVICE_BASE_URL: 'http://local.foundershare.com:3000',
        MOBILE_SERVICE_BASE_URL: 'http://local.foundershare.com:3501',
        SHARE_THIS_PUBLISHER_KEY: 'b1693be36ac5f67cf7d4eedb77174710',
        OAUTH_PUBLIC_KEY: 'C3ds4WNvZeQTod-fqBg-sPUf2WQ',

        FRIEND_INVITATION_MESSAGE_TEMPLATE: '',

        FAKE_NONCE: false,
        PASSWORD_LENGTH: 7,
        BLOG_URL: 'http://foundershare.com/wp/?p=626',
        ABOUT_URL: 'http://foundershare.com/wp/?p=765',

        LOAD_MORE_ITEM_COUNT: 4,

	/* TEMPORARY: [PMP-178] Used to set default value for buy now
	 * function */
	DEFAULT_BUY_NOW_VALUE: 100,
	MIN_BUY_NOW_VALUE: 10, // Minimal gift card amount (in $)
	OFFER_CONDITIONS_MAX_CHARS: 110,
	MAX_IMAGE_SIZE: 819200 // 800Kb
    }, window.config_local || {}))
    .constant('roles', {
        BUSINESS_ADMIN: "BUSINESS_ADMIN"
    });

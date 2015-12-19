/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */

/**
 * Contains all applications routes.
 * @author TCSASSEMBLER
 * @version 1.11
 *
 * Changes in 1.1:
 * 1. Add routes relates to gifting features
 * 2. Add WebhookController controller
 *
 * Changes in 1.2:
 *  - Added routes related to MISC updates.
 *
 * Changes in 1.3:
 * 1. remove businessId param from searchGiftCards method
 *
 * Changes in 1.4
 * - Add routes to add, get, verify and delete platformEmployee
 *
 * Changes in version 1.5
 * - Add route for update platform admin
 *
 * Changes in version 1.6:
 * - Added routes related to Misc Update 4
 * - reportAbuse is not public anymore. User needs to be logged in.
 *
 * Changes in version 1.7 (Project Mom and Pop - Gift Card Offers Search and View):
 * - Add route GET '/location'
 *
 * Changes in version 1.8 (Project Mom and Pop - MiscUpdate5):
 * - Add route GET '/platformConditions'
 *
 * Changes in 1.9 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-224] Add route /actionRecord/rate
 * 
 * Changes in 1.10 (Authentication and Social Media Integration enhancement):
 * - [PMP-242] Add routes: /users/me/connections/:type and /users/me/connections/:type
 *
 * Changes in 1.11 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] Add routes: /switchRole, /addBusiness and /champions/me
 * - [PMP-202] Added route /verifyEmailStop
 */
"use strict";

var Role = require("./Const").UserRole;

module.exports = {
    '/register': {
        post: {
            controller: "UserController",
            method: "registerUser",
            public: true
        }
    },
    '/verifyEmail': {
        post: {
            controller: "UserController",
            method: "verifyEmail",
            public: true
        }
    },
    '/verifyEmailStop': {
        post: {
            controller: "UserController",
            method: "verifyEmailStop",
            public: true
        }
    },
    '/login': {
        post: {
            controller: "UserController",
            method: "login",
            public: true
        }
    },
    '/switchRole': {
        post: {
            controller: "UserController",
            method: "switchRole",
            public: true
        }
    },
    '/addBusiness': {
        post: {
            controller: "UserController",
            method: "addBusiness",
            roles: [Role.INDIVIDUAL_USER]
        }
    },
    '/forgotPassword': {
        post: {
            controller: "UserController",
            method: "recoverPassword",
            public: true
        }
    },
    '/resetForgottenPassword': {
        post: {
            controller: "UserController",
            method: "resetForgottenPassword",
            public: true
        }
    },
    '/resetPassword': {
        post: {
            controller: "UserController",
            method: "resetPassword"
        }
    },
    '/revokeToken': {
        post: {
            controller: "UserController",
            method: "revokeAccessToken"
        }
    },
    '/refreshToken': {
        post: {
            controller: "UserController",
            method: "refreshAccessToken"
        }
    },
    '/users/me': {
        get: {
            controller: "UserController",
            method: "getMyUserProfile"
        },
        put: {
            controller: "UserController",
            method: "updateMyUserProfile"
        }
    },
    '/users/me/actions': {
        get: {
            controller: "UserController",
            method: "getMyActions"
        }
    },
    '/users/me/connections/:type': {
        post: {
            controller: "UserController",
            method: "addSocialConnection"
        },
        delete: {
            controller: "UserController",
            method: "removeSocialConnection"
        }
    },
    '/giftCardOffers': {
        get: {
            controller: "GiftCardOfferController",
            method: "searchGiftCardOffer",
            public: true
        },
        post: {
            controller: "GiftCardOfferController",
            method: "createGiftCardOffer",
            roles: [Role.BUSINESS_ADMIN]
        }
    },
    '/giftCardOffers/view/:id': {
        get: {
            controller: "GiftCardOfferController",
            method: "increaseViewCount",
            public: true
        }
    },
    '/giftCardOffers/share/:id': {
        get: {
            controller: "GiftCardOfferController",
            method: "increaseSharedCount",
            public: true
        }
    },
    '/giftCardOffers/:id': {
        get: {
            controller: "GiftCardOfferController",
            method: "getGiftCardOffer",
            public: true
        },
        put: {
            controller: "GiftCardOfferController",
            method: "updateGiftCardOffer",
            roles: [Role.BUSINESS_ADMIN]
        },
        delete: {
            controller: "GiftCardOfferController",
            method: "deleteGiftCardOffer",
            roles: [Role.BUSINESS_ADMIN, Role.PLATFORM_EMPLOYEE]
        }
    },
    '/giftCardOffers/:id/cancel': {
        post: {
            controller: "GiftCardOfferController",
            method: "cancelGiftCardOffer",
            roles: [Role.BUSINESS_ADMIN]
        }
    },
    '/giftCardOffers/:id/renew': {
        post: {
            controller: "GiftCardOfferController",
            method: "renewGiftCardOffer",
            roles: [Role.BUSINESS_ADMIN]
        }
    },
    '/giftCardOffers/:id/comments': {
        get: {
            controller: "GiftCardOfferController",
            method: "getComments",
            public: true
        },
        post: {
            controller: "GiftCardOfferController",
            method: "addComment"
        }
    },
    '/giftCardOffers/comments/:id/:businessId': {
        delete: {
            controller: "GiftCardOfferController",
            method: "removeComment",
            roles: [Role.BUSINESS_ADMIN, Role.BUSINESS_EMPLOYEE, Role.PLATFORM_EMPLOYEE]
        }
    },
    '/giftCards': {
        post: {
            controller: "GiftCardOfferController",
            method: "purchaseGiftCards",
            roles: [Role.INDIVIDUAL_USER]
        }
    },
    '/gifts': {
        get: {
            controller: "GiftCardController",
            method: "searchGiftCards",
            roles: [Role.BUSINESS_ADMIN]
        }
    },
    '/gifts/champions/:giftCardOfferId': {
        get: {
            controller: "GiftCardController",
            method: "searchGiftCardChampions",
            roles: [Role.BUSINESS_ADMIN]
        }
    },
    '/gift/:code': {
        post: {
            controller: "GiftCardController",
            method: "acceptGift",
            roles: [Role.INDIVIDUAL_USER]
        }
    },
    '/gift/:code/twitter': {
        post: {
            controller: "GiftCardController",
            method: "acceptGiftFromTwitter",
            roles: [Role.INDIVIDUAL_USER]
        }
    },
    '/giftCards/redeem': {
        post: {
            controller: "GiftCardController",
            method: "redeemGiftCard",
            roles: [Role.BUSINESS_ADMIN, Role.BUSINESS_EMPLOYEE]
        }
    },
    '/giftCards/:giftCardId/send/twitter': {
        post: {
            controller: "GiftCardController",
            method: "sendGiftToTwitter",
            roles: [Role.INDIVIDUAL_USER]
        }
    },
    '/giftCards/:giftCardId/send': {
        post: {
            controller: "GiftCardController",
            method: "sendGift",
            roles: [Role.INDIVIDUAL_USER]
        }
    },
    '/giftCards/:qrCode': {
        get: {
            controller: "GiftCardController",
            method: "getByQRCode",
            roles: [Role.BUSINESS_ADMIN, Role.BUSINESS_EMPLOYEE]
        }
    },
    '/giftCards/braintree/token': {
        get: {
            controller: "GiftCardOfferController",
            method: "getBraintreeToken"
        }
    },
    '/users/me/giftCards': {
        get: {
            controller: "GiftCardController",
            method: "searchMyGiftCards",
            roles: [Role.INDIVIDUAL_USER]
        }
    },
    '/users/me/giftCards/:id': {
        get: {
            controller: "GiftCardController",
            method: "getMyGiftCard",
            roles: [Role.INDIVIDUAL_USER]
        }
    },
    '/invitations': {
        post: {
            controller: "MiscellaneousController",
            method: "inviteFriend"
        }
    },
    '/feedbacks': {
        post: {
            controller: "MiscellaneousController",
            method: "sendFeedback",
            public: true
        }
    },
    '/reportAbuse': {
        post: {
            controller: "MiscellaneousController",
            method: "reportAbuse",
            roles: [Role.INDIVIDUAL_USER]
        }
    },
    '/businesses': {
        get: {
            controller: "BusinessController",
            method: "searchBusinesses",
            public: true
        }
    },
    '/businesses/me': {
        get: {
            controller: "BusinessController",
            method: "getMyBusinessProfile",
            roles: [Role.BUSINESS_ADMIN]
        },
        put: {
            controller: "BusinessController",
            method: "updateMyBusinessProfile",
            roles: [Role.BUSINESS_ADMIN]
        }
    },
    '/businesses/:id': {
        get: {
            controller: "BusinessController",
            method: "getBusinessProfile",
            public: true
        }
    },
    '/businesses/me/actions': {
        get: {
            controller: "BusinessController",
            method: "getMyBusinessActions",
            roles: [Role.BUSINESS_ADMIN, Role.BUSINESS_EMPLOYEE]
        }
    },
    '/businesses/all/actions': {
        get: {
            controller: "BusinessController",
            method: "getAllBusinessActions",
            roles: [Role.PLATFORM_EMPLOYEE]
        }
    },
    '/businesses/me/employees': {
        get: {
            controller: "BusinessController",
            method: "getBusinessEmployees",
            roles: [Role.BUSINESS_ADMIN]
        },
        post: {
            controller: "BusinessController",
            method: "addBusinessEmployee",
            roles: [Role.BUSINESS_ADMIN]
        }
    },
    '/businesses/me/employees/:id': {
        put: {
            controller: "BusinessController",
            method: "updateBusinessEmployee",
            roles: [Role.BUSINESS_ADMIN]
        },
        delete: {
            controller: "BusinessController",
            method: "deleteBusinessEmployee",
            roles: [Role.BUSINESS_ADMIN]
        }
    },
    '/businesses/me/verify': {
        post: {
            controller: "BusinessController",
            method: "payForVerification",
            roles: [Role.BUSINESS_ADMIN]
        }
    },
    '/businesses/:id/platform/verify': {
        post: {
            controller: "BusinessController",
            method: "verifyByPlatformAdmin",
            roles: [Role.PLATFORM_EMPLOYEE]
        }
    },
    '/feedbackTypes': {
        get: {
            controller: "LookupController",
            method: "getAllFeedbackTypes",
            public: true
        }
    },
    '/businessTypes': {
        get: {
            controller: "LookupController",
            method: "getAllBusinessTypes",
            public: true
        }
    },
    '/platformConditions': {
        get: {
            controller: "LookupController",
            method: "getPlatformConditions",
            public: true
        }
    },
    '/webhook/mailgun/message/delivered': {
        post: {
            controller: "WebhookController",
            method: "mailgunMessageDelivered",
            public: true
        }
    },
    '/webhook/braintree/subscription': {
        get: {
            controller: "WebhookController",
            method: "subscription",
            public: true
        },
        post: {
            controller: "WebhookController",
            method: "subscriptionChanged",
            public: true
        }
    },
    '/users/platformAdmins': {
        post: {
            controller: "UserController",
            method: "addPlatformAdmin",
            roles: [Role.PLATFORM_EMPLOYEE]
        },
        get: {
            controller: "UserController",
            method: "getAllPlatformAdmins",
            roles: [Role.PLATFORM_EMPLOYEE]
        }
    },
    '/users/platformAdmins/verify': {
        post: {
            controller: "UserController",
            method: "verifyPlatformAdmin",
            public: true
        }
    },
    '/users/platformAdmins/:id': {
        delete: {
            controller: "UserController",
            method: "deletePlatformAdmin",
            roles: [Role.PLATFORM_EMPLOYEE]
        }
    },
    '/staticPages': {
        get: {
            controller: 'StaticPageController',
            method: 'getAllPages',
            roles: [Role.PLATFORM_EMPLOYEE]
        }
    },
    '/staticPages/:name': {
        get: {
            controller: 'StaticPageController',
            method: 'getPageByName',
            public: true
        },
        put: {
            controller: 'StaticPageController',
            method: 'updatePage',
            roles: [Role.PLATFORM_EMPLOYEE]
        }
    },
    '/fileUpload': {
        post: {
            controller: 'StaticPageController',
            method: 'uploadFile',
            roles: [Role.PLATFORM_EMPLOYEE]
        }
    },
    '/users/me/platformAdmins': {
        post: {
            controller: "UserController",
            method: "updatePlatformAdmin",
            roles: [Role.PLATFORM_EMPLOYEE]
        }
    },
    '/location': {
        get: {
            controller: 'MiscellaneousController',
            method: 'getCoordinates',
            public: true
        }
    },
    '/actionRecord/rating': {
        post: {
            controller: 'MiscellaneousController',
            method: 'setRatings'
        }
    },
    '/sharing/share': {
        post: {
            controller: 'SharingController',
            method: 'share'
        }
    },
    '/champions/me': {
        get: {
            controller: "ChampionController",
            method: "getMyChampionProfile",
            roles: [Role.INDIVIDUAL_USER]
        },
        put: {
            controller: "ChampionController",
            method: "updateMyChampionProfile",
            roles: [Role.INDIVIDUAL_USER]
        }
    },
};

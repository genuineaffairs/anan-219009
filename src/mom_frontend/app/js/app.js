/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * The main application entry
 *
 * Changes in version 1.1:
 *  - Changed the url route.
 *
 * Changes in version 1.2:
 *  - Fixed the integration issues.
 *
 * Changes in version 1.3:
 *  - Implement gifting
 *  - Add url redirection from ?go=url to /#url
 *
 * Changes in version 1.4:
 *  - Added openUrl method.
 *  - Handled login page redirect logic.
 *  - Added some routes for MISC updates.
 *
 * Changes in version 1.5:
 *  - Disable caching for GET requests in IE
 *  - Detect old browser and alert message
 *  - Add summary page
 *
 * Changes in version 1.6
 * - Add AddEmployee route
 * - Add VerifyPlatformEmployee route
 * - Add cgNotify dependency
 * - Add BusinessAccountSetup route
 * - Add openGraphTags
 *
 * Changes in version 1.7
 * - Remove openGraphTags scope variable
 *   Since the facebook crawler crawls the webpage, the angular scope variables is not parsed,
 *   because these variables doesn't exist in that context.
 *
 * Changes in version 1.8:
 * - PMP-182 Add static pages routes
 * - Load CKEditor library
 *
 * Changes in version 1.9 (Project Mom and Pop - Gift Card Offers Search and View):
 * - use location.url() instead location.path() when redirecting
 *
 * Changes in version 1.10 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-159] Add Breadcrumbs
 *
 * Changes in version 1.11 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-202] Added route /VerifyEmailStop to stop the verification email reminder
 *
 * @version 1.11
 * @author TCSASSEMBLER
 */
'use strict';

var app = angular.module("app", ["ngRoute", "ngDropdowns", "flow", "infinite-scroll", 'LocalStorageModule', 
    "ng.deviceDetector", "cgNotify", "crumble", "angulartics", "angulartics.google.analytics"]);

// Initialize the main module
app.run(['$rootScope', '$location', '$window', '$log', '$interval', 'SecurityService', 'UserService', 'storage', 'config', 'util', 'GiftCardOfferService', 'crumble',
	function ($rootScope, $location, $window, $log, $interval, SecurityService, UserService, storage, config, util, GiftCardOfferService, crumble) {

        $(document).ready(function () {
            OAuth.initialize(config.OAUTH_PUBLIC_KEY);
        });

        //keep temporary data between controllers
        $rootScope.tmp = {};
        $rootScope.location = $location;
        $rootScope.config = config;
        $rootScope.goto = function (path) {
            $rootScope.isExpand = false;
            if (path === 'back') { // Allow a 'back' keyword to go to previous page
                $window.history.back();
            } else { // Go to the specified path
                $location.url(path);
            }
        };

        //Load CKEditor library
        if ($location.path() === '/EditStaticPages' && util.isLoggedIn() && util.getUserRoles(util.PLATFORM_EMPLOYEE)) {
            $rootScope.loadCKEditor = true;
        }

        /**
         * Get homepage url based on role
         * @return {String} the url
         */
        $rootScope.getHome = function () {
            if (!util.isLoggedIn()) {
                return "/";
            }
            if (util.getUserRoles(util.PLATFORM_EMPLOYEE)) {
                $location.url('/FounderStatus');
            } else {
                $location.url('/Founder$hares');
            }
        };
        /**
         * Redirect to sharer page
         * @param destination the target social network e.g. twitter, facebook
         * @param offer the offer
         * @param offerTitle the offer title
         */
        $rootScope.shareUrl = function (destination, offer, offerTitle) {
            //popup must be open immediately otherwise browser will block it
            $rootScope.openShareWindow(destination, offer, offerTitle);
            GiftCardOfferService.increaseSharedCount(offer.id).catch(function () {
                console.log("Cannot increase share count.");
            });

        };

        /**
         * Open the share window.
         * @param destination the target social network e.g. twitter, facebook
         * @param offerId the offer id
         * @param offerTitle the offer title
         */
        $rootScope.openShareWindow = function (destination, offer, offerTitle) {
            var pageUrl = $location.absUrl().split("#")[0];
            if (offer) {
                pageUrl += "#/?offerId=" + offer.id;
            }
            window.open('https://plus.google.com/share?url=' + pageUrl,
                '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
        };

        /**
         * Open url.
         * @param destination the target url
         */
        $rootScope.openUrl = function (destination) {
            $window.open(destination, '_blank');
        };

        $rootScope.$on('$routeChangeStart', function (e, target) {
            $rootScope.modal = false;
            var route = target.$$route;
            if (!route) {
                return;
            }
            $rootScope.header.page = route.headerPage;
            $rootScope.header.stickExpanded = false;
            $rootScope.header.hasAside = route.hasAside;
            if (!$rootScope.tmp) {
                $rootScope.tmp = {};
            }
            if (route.originalPath !== '/Login') {
                $rootScope.tmp.redirectUrl = route.originalPath;
            } else {
                if ($rootScope.tmp.redirectUrl === '/' && $rootScope.tmp.offerId) {
                    $rootScope.tmp.redirectUrl += '?offerId=' + $rootScope.tmp.offerId;
                }
            }
            if (route.isPublic) {
                return;
            }
            if (!util.isLoggedIn()) {
                $location.url('/Login');
                return;
            }
            if (!route.roles) {
                return;
            }
            var hasAccess = _.any(route.roles, util.getUserRoles);
            if (!hasAccess) {
                $location.url('/');
            }
        });

        if (!util.isLoggedIn()) {
            storage.clear();
        } else {
            $rootScope.loggedUser = storage.getCurrentUserProfile();
            util.refreshUser();
        }
        $rootScope.shortDateFormat = 'MM/dd/yyyy';
        $rootScope.longDateFormat = 'MM/dd/yyyy hh:mm a';

        $(document).on('scroll', function () {
            var previous = $rootScope.header.stick;
            $rootScope.header.stick = $(document).scrollTop() > 90;
            if ($rootScope.header.stick !== previous) {
                $rootScope.$apply();
            }
        });
													     // Setup Crumble
	var getParent = crumble.getParent;
	crumble.getParent = function (path) {
	    var route = crumble.getRoute(path);
	    return route && angular.isDefined(route.parent) ? route.parent : getParent(path);
	};

    }]);


// Check for mobile device and redirect to mobile version
app.run(['config', 'deviceDetector', '$location', 'notify', function (config, deviceDetector, $location, notify) {
    if (deviceDetector.isMobile() && !deviceDetector.isTablet()) {
        window.location = config.MOBILE_SERVICE_BASE_URL + "#" + $location.url();
        return;
    }
    //IE check is in index.html
    if (deviceDetector.raw.browser.opera || deviceDetector.raw.browser.unknown) {
        notify({message: window.notSupportedBrowserError, templateUrl: 'partials/module/notify-popup.html'});
    }
}]);

app.config(['$httpProvider', "config", function ($httpProvider, config) {
    //disable IE ajax request caching
    $httpProvider.interceptors.push(function () {
        return {
            request: function (reqConfig) {
                if (reqConfig.url.indexOf(config.REST_SERVICE_BASE_URL) === 0) {
                    reqConfig.headers['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
                }
                return reqConfig;
            }
        }
    });
}]);

app.run(['$rootScope', function ($rootScope) {
    $rootScope.$watch("loggedUser", function (value) {
        if (value) {
            ga("set", "&uid", value.id);
        } else {
            ga("set", "&uid", null);
        }
    });
}]);

app.config(["$routeProvider",
    function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "partials/Home.html",
                controller: 'homeCtrl',
                isPublic: true,
                hasAside: true,
                headerPage: 'home',
                label: ''
            })
            .when("/Login", {
                templateUrl: "partials/Login.html",
                controller: 'loginCtrl',
                isPublic: true,
                hasAside: true,
                label: 'Login'
            })
            .when("/history", {
                templateUrl: "partials/history.html",
                controller: 'historyCtrl',
                label: 'My History',
                parent: '/myInfo'
            })

            .when("/myInfo", {
                templateUrl: "partials/MyInfo.html",
                controller: 'profileCtrl',
                label: 'My Profile'
            })
            .when("/FounderMyEmployees", {
                templateUrl: "partials/MyEmployees.html",
                controller: 'businessEmployeesCtrl',
                label: 'My Employees',
                parent: '/myInfo'
            })
            .when("/Payment/:purpose", {
                templateUrl: "partials/Payment.html",
                controller: 'paymentCtrl',
                label: 'Payment',
                parent: '/'
            })
            .when("/PaymentVerification/:purpose", {
                templateUrl: "partials/PaymentVerification.html",
                controller: 'paymentVerificationCtrl',
                label: 'Payment Verification',
                parent: '/'
            })
            .when("/VerifyAccount", {
                templateUrl: "partials/VerifyAccount.html",
                controller: 'verifyAccountCtrl',
                label: 'Verify Account'
            })
            .when("/ShoppingCart", {
                templateUrl: "partials/ShoppingCart.html",
                controller: 'shoppingCartCtrl',
                label: 'Payment'
            })
            .when("/FounderStatus", {
                templateUrl: "partials/FounderStatus.html",
                controller: 'founderStatusCtrl',
                label: 'Founder Status',
                parent: '/myInfo'
            })
            .when("/Founder$hares", {
                templateUrl: "partials/Founder$hares.html",
                controller: 'giftCardOffersCtrl',
                label: 'My Founder$hares',
                parent: '/myInfo'
            })
            .when("/GiftCardSummary", {
                templateUrl: "partials/GiftCardSummary.html",
                controller: 'giftCardSummaryCtrl',
                label: 'Gift Card Summary',
                parent: '/myInfo'
            })
            .when("/FounderF$Posting", {
                templateUrl: "partials/FounderF$Posting.html",
                controller: 'giftCardOfferCtrl',
                label: 'Post F$',
                parent: '/myInfo'
            })
            .when("/AllPostings", {
                templateUrl: "partials/AllPostings.html",
                controller: 'allPostingsCtrl',
                label: 'All Postings',
                parent: '/myInfo'
            })
            .when('/AddPlatformAdmin', {
                templateUrl: 'partials/addPlatformAdmin.html',
                controller: 'addPlatformAdminCtrl',
                resolve: {
                    adminList: function (UserService) {
                        return UserService.getAllPlatformAdmins();
                    }
                },
                label: 'Add Platform Admin',
                parent: '/myInfo'
            })
            .when('/EditStaticPages', {
                templateUrl: 'partials/EditStaticPages.html',
                controller: 'editStaticPagesCtrl',
                label: 'Edit Static Pages',
                parent: '/myInfo'
            })
            .when('/BusinessAccountSetup', {
                templateUrl: 'partials/businessAccountSetup.html',
                controller: 'businessAccountSetupCtrl',
                label: 'Business Account Setup',
                parent: '/myInfo'
            })
            .when('/VerifyPlatformEmployee', {
                controller: 'VerifyPlatformEmployeeCtrl',
                templateUrl: 'partials/VerifyPlatformEmployee.html',
                isPublic: true,
                label: 'Verify Platform Employee'
            })
            .when("/FounderF$Gifting/:id", {
                templateUrl: "partials/Gifting.html",
                controller: 'giftingCtrl',
                label: 'Founder$hare Gifting',
                parent: '/Founder$hares'
            })
            .when("/Gift/:code", {
                templateUrl: "partials/OpenGift.html",
                controller: 'openGiftCtrl',
                isPublic: true,
                label: 'Open Gift',
                parent: '/'
            })
            .when("/ReportAbuse/:giftCardOfferId", {
                templateUrl: "partials/ReportAbuse.html",
                controller: 'reportAbuseCtrl',
                isPublic: true,
                label: 'Report Abuse',
                parent: '/'
            })
            .when("/ProvideFeedback", {
                templateUrl: "partials/ProvideFeedback.html",
                controller: 'feedbackCtrl',
                isPublic: true,
                label: 'Provide Feedback'
            })
            .when("/Register", {
                templateUrl: "partials/Register.html",
                controller: 'registerCtrl',
                isPublic: true,
                label: 'Register'
            })
            .when("/VerifyEmail/:userId/:token", {
                templateUrl: "partials/VerifyEmail.html",
                controller: 'verifyEmailCtrl',
                isPublic: true,
                label: 'Verify Email',
                parent: '/'
            })
            .when("/StopVerify/:userId/:token", {
                templateUrl: "partials/VerifyEmailStop.html",
                controller: 'verifyEmailStopCtrl',
                isPublic: true,
                label: 'Stop Verify Email',
                parent: '/'
            })
            .when("/ResetPassword", {
                templateUrl: "partials/ResetPassword.html",
                controller: 'resetPasswordCtrl',
                isPublic: true,
                label: 'Reset Password'
            })
            .when("/ForgotPassword", {
                templateUrl: "partials/ForgotPassword.html",
                controller: 'forgotPasswordCtrl',
                isPublic: true,
                label: 'Forgot Password'
            })

            //==================//
            .when('/HowItWorks', {
                templateUrl: 'partials/HowItWorks.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'howItWorks',
                label: 'How It Works'
            })
            .when('/HowItWorks/business', {
                templateUrl: 'partials/HowItWorksBusiness.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'howItWorks',
                label: 'Business',
                parent: '/HowItWorks'
            })
            .when('/HowItWorks/customer', {
                templateUrl: 'partials/HowItWorksCustomer.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'howItWorks',
                label: 'Customer',
                parent: '/HowItWorks'
            })
            .when('/About', {
                templateUrl: 'partials/About.html',
                isPublic: true,
                headerPage: 'about',
                label: 'About'
            })
            .when('/Blog', {
                templateUrl: 'partials/Blog.html',
                isPublic: true,
                headerPage: 'blog',
                label: 'Blog'
            })
            .when('/Faq', {
                templateUrl: 'partials/Faq.html',
                controller: 'staticPagesCtrl',
                isPublic: true,
                headerPage: 'faq',
                label: 'FAQ'
            })
            .when('/Copyright', {
                templateUrl: 'partials/Copyright.html',
                controller: 'staticPagesCtrl',
                isPublic: true,
                label: 'Copyright'
            })
            .when('/PrivacyPolicy', {
                templateUrl: 'partials/PrivacyPolicy.html',
                controller: 'staticPagesCtrl',
                isPublic: true,
                label: 'Privacy Policy'
            })
            .when('/TermsAndConditions', {
                templateUrl: 'partials/TermsAndConditions.html',
                controller: 'staticPagesCtrl',
                isPublic: true,
                label: 'Terms And Conditions'
            })

            //==================//

            .otherwise({
                redirectTo: '/'
            });
    }
]);


(function () {
    var query = window.location.search;
    //twitter urls must be without # hash
    //redirect url like /?go=page/123 to /#/page/123
    if (query && query.indexOf("go=") !== -1) {
        var split = query.split("go=");
        var url = window.location.pathname + "#" + decodeURIComponent(split.pop());
        window.location = url;
    }
})();

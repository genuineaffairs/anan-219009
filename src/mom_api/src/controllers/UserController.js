/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */

/**
 * This controller exposes REST actions for user
 *
 * Changes in version 1.1:
 * - Added verifyEmail() method and fixed some other issues.
 *
 * Changes in version 1.2
 * - Capitalize 'i' in 'invalid email or password'
 * - Add API's to add, get and delete platform employees
 *
 * Changes in version 1.3
 * - Add API for update platform admin
 *
 * Changes in version 1.4 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-206] Remove Business.conditions field
 *
 * Changes in version 1.5 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-220] Add subscribedToNews field
 * - Fixed critical bug that crashes the server when email is verified twice
 * - Limit profile picture size to 1Mb
 *
 * Changes in 1.6 (Authentication and Social Media Integration enhancement):
 * - [PMP-242] Connect social login by email, Add support to multiple social logins
 *
 * Changes in 1.7 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] - Updated Register logic to implement new champion schema, Added switchRole and addBusiness
 * - [PMP-202] - Added verifyEmailStop
 *
 * @author TCSASSEMBLER
 * @version 1.7
 */
'use strict';

var async = require("async");
var _ = require("underscore");
var config = require("config");
var awsHelper = require("../common/awsHelper");
var helper = require("../common/helper");
var ValidationError = require("../common/errors").ValidationError;
var UnauthorizedError = require("../common/errors").UnauthorizedError;
var NotFoundError = require("../common/errors").NotFoundError;
var validate = require("../common/validator").validate;
var Const = require("../Const");
var UserService = require("../services/UserService");
var SecurityService = require("../services/SecurityService");
var BusinessService = require("../services/BusinessService");
var ChampionService = require("../services/ChampionService");
var NotificationService = require("../services/NotificationService");
var ActionRecordService = require("../services/ActionRecordService");


/**
 * Add social network connection to user and generate session token
 * @param {Object} user the target user
 * @param {Object} linkedSocialNetwork the social network data
 * @param {Boolean} generateSessionToken the flag if generate session token for that user
 * @param {Function} callback the callback function
 * @private
 */
function _autoConnectUser(user, linkedSocialNetwork, generateSessionToken, callback) {
    if (!user.linkedSocialNetworks) {
        user.linkedSocialNetworks = [];
    }
    //remove existing connection if exists
    user.linkedSocialNetworks = _.filter(user.linkedSocialNetworks, function (connection) {
        return connection.socialNetwork !== linkedSocialNetwork.socialNetwork;
    });
    user.linkedSocialNetworks.push(linkedSocialNetwork);
    _.each(user.linkedSocialNetworks, function (item) {
        delete item.id;
    });
    async.waterfall([
        function (cb) {
            UserService.update(user.id, {linkedSocialNetworks: user.linkedSocialNetworks}, cb);
        }, function (user, cb) {
            if (!generateSessionToken) {
                return cb();
            }
            SecurityService.generateSessionToken(user.id, cb);
        }
    ], callback);
}

/**
 * Register a user.
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function registerUser(req, res, next) {
    var registration, userId;
    try {
        registration = JSON.parse(req.body.registration);
    } catch (e) {
        return next(new ValidationError("registration field must be a valid json object"));
    }
    var error = validate(
        {registration: registration},
        {
            registration: {
                __strict: false,
                accountType: "AccountType",
                linkedSocialNetwork: "SocialNetwork?",
                linkedSocialNetworkAccessToken: "ShortString?"
            }
        });
    if (error) {
        return next(error);
    }

    // Photo file size can not exceed 1Mb (1048576 bytes)
    if (req.files && req.files.profileImage && req.files.profileImage.size > 1048576) {
        return next(new ValidationError("Your profile picture can not exceed 1Mb in size."));
    }

    var user = {};
    async.waterfall([
        function (cb) {
            if (registration.linkedSocialNetwork) {
                if (!registration.linkedSocialNetworkAccessToken) {
                    return next(new ValidationError('linkedSocialNetworkAccessToken is required'));
                }
                if (registration.linkedSocialNetwork === Const.SocialNetwork.TWITTER) {
                    error = validate(
                        {email: registration.email},
                        {email: "email"});
                    if (error) {
                        return cb(error);
                    }
                }
                
                async.waterfall([
                    function (cb) {
                        SecurityService.getSocialNetworkProfile(registration.linkedSocialNetwork, registration.linkedSocialNetworkAccessToken, cb);
                    }, function (profile, cb) {
                        _.extend(user, profile);
                        if (registration.linkedSocialNetwork === Const.SocialNetwork.TWITTER) {
                            user.email = registration.email;
                        }
                        UserService.getBySocialNetwork(registration.linkedSocialNetwork, profile.linkedSocialNetworks[0].socialUserId, cb);
                    }, function (existing, cb) {
                        if (existing) {
                            SecurityService.generateSessionToken(existing.id, cb.wrap(function (token) {
                                res.json({
                                    autoConnect: true,
                                    sessionToken: token
                                });
                            }));
                        } else {
                            cb();
                        }
                    }
                ], cb);
            } else {
                //for normal login these fields are expected
                error = validate(
                    {registration: registration},
                    {
                        registration: {
                            __strict: false,
                            firstName: "ShortString",
                            lastName: "ShortString",
                            email: "email",
                            password: "ShortString",
                            interestedOfferCategory: "ShortString?",
                            subscribedToNews: "bool?"
                        }
                    });
                if (error) {
                    return cb(error);
                }
                _.extend(user, _.pick(registration, "firstName", "lastName", "email", "password", "interestedOfferCategory", "subscribedToNews"));
                cb();
            }
        }, function (cb) {
            if (!user.email) {
                return cb();
            }
            UserService.getByEmail(user.email, cb.wrap(function (existing) {
                if (!existing) {
                    return cb();
                }
                if (!registration.linkedSocialNetwork || registration.linkedSocialNetwork === Const.SocialNetwork.TWITTER) {
                    if(existing.userRoles.length === 1 && existing.userRoles[0].role === Const.UserRole.INDIVIDUAL_USER) {
                        return cb(new ValidationError('This email address is already registered with champion account.'));
                    }
                    return cb(new ValidationError('This email address is already registered.'));
                }
                //auto connect user
                //don't auto connect for twitter, because email is manually set by frontend user
                _autoConnectUser(existing, user.linkedSocialNetworks[0], true, cb.wrap(function (token) {
                    res.json({
                        autoConnect: true,
                        sessionToken: token
                    });
                }));
            }));
        }, function (cb) {
            var champion = {};
            if (req.files && req.files.profileImage) {
                awsHelper.uploadPhotoToS3(req.files.profileImage, cb.wrap(function (url) {
                    champion.picture = url;
                    cb(null, champion);
                }));
            } else {
                cb(null, champion);
            }
        }, function(champion, cb){
            ChampionService.create(champion, cb);
        }, function (result, cb) {
            user.userRoles = [{
                championId: result.id,
                role: Const.UserRole.INDIVIDUAL_USER
            }];
            if (registration.accountType !== Const.AccountType.CHAMPION) {
                if (!registration.hasOwnProperty("business")) {
                    registration.business = {};
                }
                var business = _.pick(registration.business, "name", "type", "streetAddress", "city", "state", "country", "zip", "telephoneNumber", "businessHours", "description", "website");
                async.waterfall([
                    function (cb) {
                        if (req.files && req.files.businessImage) {
                            awsHelper.uploadPhotoToS3(req.files.businessImage, cb.wrap(function (url) {
                                business.picture = url;
                                cb();
                            }));
                        } else {
                            cb();
                        }
                    }, function (cb) {
                        BusinessService.create(business, cb);
                    }, function (result, cb) {
                        user.userRoles.push({
                            businessId: result.id,
                            role: Const.UserRole.BUSINESS_ADMIN
                        });
                        cb();
                    }
                ], cb);
            } else cb ();
        }, function (cb) {
            user.verifyEmailText = helper.randomString(Const.SAFE_RANDOM_LENGTH);
            user.verifyEmailExpirationDate = new Date().getTime();
            UserService.create(user, cb);
        }, function (user, cb) {
            userId = user.id;
            var token = userId + "/" + user.verifyEmailText;
            NotificationService.sendEmail(user.email, 'verify-user-email',
                {token: token, prefix: config.VERIFY_EMAIL_URL_PREFIX}, cb);
        }, function (user, cb) {
            SecurityService.generateSessionToken(userId, cb);
        }, function (token) {
            res.json({
                sessionToken: token
            });
        }
    ], next);
}

/**
 * Verify email.
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 * @return the session token.
 */
function verifyEmail(req, res, next) {
    var requestData;
    try {
        requestData = JSON.parse(req.body.requestData);
    } catch (e) {
        return next(new ValidationError("requestData field must be a valid json object"));
    }
    var error = validate(
        {requestData: requestData},
        {
            requestData: {
                __strict: false,
                userId: "ShortString?",
                token: "ShortString?"
            }
        });
    if (error) {
        return next(error);
    }

    async.waterfall([
        function (cb) {
            UserService.get(requestData.userId, cb.wrap(function (user) {
                if (!user) {
                    cb(new ValidationError('Cannot find the user by given user id.'));
                } else {
                    if (!user.verifyEmailText || user.verifyEmailText === 'verified') {
                        return cb(new ValidationError('The Email address is already verified.'));
                    }
                    if (user.verifyEmailText !== requestData.token) {
                        return cb(new ValidationError('The email verification text is invalid.'));
                    }

                    var newUser = {
                        verifyEmailText: 'verified',
                        verifyEmailExpirationDate: new Date().getTime() + 100 * 365 * 24 * 60 * 60 * 1000
                    };
                    UserService.update(user.id, newUser, cb);
                }
            }));
        }, function (user, cb) {
            SecurityService.generateSessionToken(requestData.userId, cb);
        }, function (token) {
            res.json({
                sessionToken: token
            });
        }
    ], next);
}

/**
 * Stop Email Verification reminders. In other words, remove the user.
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 * @return the session token.
 */
function verifyEmailStop(req, res, next) {
    var requestData;
    try {
        requestData = JSON.parse(req.body.requestData);
    } catch (e) {
        return next(new ValidationError("requestData field must be a valid json object"));
    }
    var error = validate(
        {requestData: requestData},
        {
            requestData: {
                __strict: false,
                userId: "ShortString?",
                token: "ShortString?"
            }
        });
    if (error) {
        return next(error);
    }

    async.waterfall([
        function (cb) {
            UserService.get(requestData.userId, cb.wrap(function (user) {
                if (!user) {
                    cb(new ValidationError('Cannot find the user by given user id.'));
                } else {
                    if (!user.verifyEmailText || user.verifyEmailText === 'verified') {
                        return cb(new ValidationError('The Email address is already verified.'));
                    }
                    if (user.verifyEmailText !== requestData.token) {
                        return cb(new ValidationError('The email verification text is invalid.'));
                    }
                    var newUser = {
                        isStopVerificationReminder: true
                    };
                    UserService.update(user.id, newUser, cb);
                }
            }));
        }, function () {
            res.json({message: 'OK. We hear you. You should not receive any more verification emails from us. ' +
            'You know where to find us if you change your mind!'});
        }
    ], next);
}

/**
 * Register a user.
 * @param  {Object} req the request
 * @param  {Object} res the response
 * @param  {Function} next the next middleware
 */
function login(req, res, next) {
    var error = validate(
        {loginType: req.query.type},
        {loginType: "AuthenticationType"});
    if (error) {
        return next(error);
    }
    var type = req.query.type;
    if (type === Const.AuthenticationType.PASSWORD) {
        SecurityService.authenticate(req.body.email, req.body.password, function (err, user) {
            if (err) {
                if (err.httpStatus === 400) {
                    return next(err);
                }
                return next(new UnauthorizedError("Invalid email or password"));
            }
            SecurityService.generateSessionToken(user.id, next.wrap(function (token) {
                res.json({
                    sessionToken: token
                });
            }));
        });
    } else {
        var token = req.body.accessToken;
        var socialProfile;
        async.waterfall([
            function (cb) {
                SecurityService.authenticateWithSocialNetwork(type, token, cb);
            }, function (profile, cb) {
                socialProfile = profile;
                UserService.getBySocialNetwork(type, String(profile.id), cb);
            }, function (user, cb) {
                if (user) {
                    SecurityService.generateSessionToken(user.id, cb);
                } else {
                    //check if email from social profile exists in any user
                    var email;
                    if (type === Const.SocialNetwork.FACEBOOK) {
                        email = socialProfile.email;
                    } else if (type === Const.SocialNetwork.LINKEDIN) {
                        email = socialProfile.emailAddress;
                    } else {
                        return cb(new NotFoundError('User is not registered'));
                    }

                    async.waterfall([
                        function (cb) {
                            UserService.getByEmail(email, cb);
                        }, function (existing, cb) {
                            if (!existing) {
                                return cb(new NotFoundError('User is not registered'));
                            }
                            var linkedSocialNetwork = {
                                socialUserId: String(socialProfile.id),
                                socialNetwork: type,
                                accessToken: token
                            };
                            _autoConnectUser(existing, linkedSocialNetwork, true, cb.wrap(function (token) {
                                res.json({
                                    sessionToken: token
                                });
                            }));
                        }
                    ], cb);
                }
            }, function (token) {
                res.json({
                    sessionToken: token
                });
            }
        ], next);
    }
}

/**
 * Get profile of logged user.
 * @param  {Object} req the request
 * @param  {Object} res the response
 * @param  {Function} next the next middleware
 */
function getMyUserProfile(req, res, next) {
    async.parallel([
        function (cb) {
            if (req.user.businessId) BusinessService.get(req.user.businessId, cb.wrap(function(business) {
                req.user.business = business;
                cb();
            }));
            else cb ();
        }, function (cb) {
            if (req.user.championId) {
                ChampionService.get(req.user.championId, cb.wrap(function(champion) {
                    req.user.champion = champion;
                    cb();
                }));
            } else cb();
        }
    ], next.wrap(function () {
        res.json(req.user);
    }));
}

/**
 * Update profile of logged user.
 * @param  {Object} req the request
 * @param  {Object} res the response
 * @param {Function} next the next middleware
 */
function updateMyUserProfile(req, res, next) {
    var values = req.body;
    values = _.pick(values, 'password', 'firstName', 'lastName', 'email', 'location',
        'isLastNamePublic', 'isEmailPublic', 'isLocationPublic', 'interestedOfferCategory', 'subscribedToNews');
    _.each(['isLastNamePublic', 'isEmailPublic', 'isLocationPublic', 'subscribedToNews' ], function (prop) {
        if (values.hasOwnProperty(prop)) {
            if (values[prop] === 'true') {
                values[prop] = true;
            }
            if (values[prop] === 'false') {
                values[prop] = false;
            }
        }
    });

    UserService.update(req.user.id, values, next.wrap(function(user) {
        res.json(helper.mapUser(user));
    }))
}

/**
 * Send email with reset password link
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function recoverPassword(req, res, next) {
    var error = validate(
        {email: req.query.email},
        {email: "email"});
    if (error) {
        return next(error);
    }
    var email = req.query.email;
    async.waterfall([
        function (cb) {
            SecurityService.recoverPassword(email, cb);
        }, function (token, cb) {
            var resetLink;
            if (req.query.version === "mobile") {
                resetLink = config.MOBILE_APP_URL + '/#/ResetPassword?token=' + token;
            } else {
                resetLink = config.DESKTOP_APP_URL + '/#/ResetPassword?token=' + token;
            }
            NotificationService.notifyUserOfPassword(email, resetLink, cb);
        }, function () {
            res.end();
        }
    ], next);
}

/**
 * Reset password using a reset password token
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function resetForgottenPassword(req, res, next) {
    async.waterfall([
        function (cb) {
            SecurityService.updateForgottenPassword(req.body.token, req.body.newPassword, cb);
        }, function (user, cb) {
            SecurityService.generateSessionToken(user.id, cb);
        }, function (token) {
            res.json({
                sessionToken: token
            });
        }
    ], next);
}

/**
 * Reset a password
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function resetPassword(req, res, next) {
    async.waterfall([
        function (cb) {
            SecurityService.updatePassword(req.user.id, req.body.newPassword, cb);
        }, function () {
            res.end();
        }
    ], next);
}

/**
 * Revoke the access token
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function revokeAccessToken(req, res, next) {
    SecurityService.revokeSessionToken(req.sessionToken, next.wrap(function () {
        res.end();
    }));
}

/**
 * Refresh the access token
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function refreshAccessToken(req, res, next) {
    async.waterfall([
        function (cb) {
            SecurityService.revokeSessionToken(req.sessionToken, cb);
        }, function (cb) {
            SecurityService.generateSessionToken(req.user.id, cb);
        }, function (token) {
            res.json({
                sessionToken: token
            });
        }
    ], next);
}

/**
 * Get actions of current user
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function getMyActions(req, res, next) {
    var criteria = req.query;
    helper.fixQueryStringForSearchCriteria(criteria);
    criteria.userId = req.user.id;
    ActionRecordService.search(criteria, next.wrap(function (result) {
        res.json(result);
    }));
}

/**
 * Add a platform employee
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function addPlatformAdmin(req, res, next) {
    UserService.addPlatformAdmin(req.body, req.user, next.wrap(function (result) {
        res.json(helper.mapUser(result));
    }));
}

/**
 * Get all platform employees
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function getAllPlatformAdmins(req, res, next) {
    UserService.getAllPlatformAdmins(next.wrap(function (result) {
        var users = [];
        _.forEach(result, function (user) {
            users.push(helper.mapUser(user));
        });
        res.json(users);
    }));
}

/**
 * Delete all platform employees
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function deletePlatformAdmin(req, res, next) {
    UserService.deletePlatformAdmin(req.params.id, req.body, req.user, next.wrap(function (result) {
        res.json(result);
    }));
}

/**
 * Verify a platform employee
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function verifyPlatformAdmin(req, res, next) {
    UserService.verifyPlatformAdmin(req.body, next.wrap(function (result) {
        res.json(result);
    }));
}

/**
 * Update a platform employee
 * A platform employee can only update own profile information
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function updatePlatformAdmin(req, res, next) {
    UserService.updatePlatformAdmin(req.body, req.user, next.wrap(function (result) {
        res.json(result);
    }));
}

/**
 * Add social connection to current user
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function addSocialConnection(req, res, next) {
    var socialNetwork = req.params.type;
    var accessToken = req.body.accessToken;
    var socialProfile;
    async.waterfall([
        function (cb) {
            SecurityService.getSocialNetworkProfile(socialNetwork, accessToken, cb);
        }, function (profile, cb) {
            socialProfile = profile;
            UserService.getBySocialNetwork(socialNetwork, profile.linkedSocialNetworks[0].socialUserId, cb);
        }, function (user, cb) {
            if (user && user.id !== req.user.id) {
                return next(new ValidationError("Account is already connected with different user. Please log out from this browser and try again."));
            }
            _autoConnectUser(req.user, socialProfile.linkedSocialNetworks[0], false, cb);
        }, function () {
            res.end();
        }
    ], next);
}


/**
 * Remove social connection from current user
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function removeSocialConnection(req, res, next) {
    var socialNetwork = req.params.type;
    var error = validate({socialNetwork: socialNetwork}, {socialNetwork: "SocialNetwork"});
    if (error) {
        return next(error);
    }
    var user = req.user;
    if (!user.linkedSocialNetworks) {
        user.linkedSocialNetworks = [];
    }
    user.linkedSocialNetworks = _.filter(user.linkedSocialNetworks, function (connection) {
        return connection.socialNetwork !== socialNetwork;
    });
    _.each(user.linkedSocialNetworks, function (item) {
        delete item.id;
    });
    UserService.update(user.id, {linkedSocialNetworks: user.linkedSocialNetworks}, next.wrap(function () {
        res.end();
    }));
}

/**
 * Switch logged in user role
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Object} next the next middleware
 */
function switchRole (req, res, next) {
    SecurityService.switchRole(req.sessionToken, req.body.role, next.wrap(function(token) {
        res.json({
            sessionToken: token
        });
    }));
}

/**
 * Adds business role to existing champion
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Object} next the next middlewaret
 */
function addBusiness (req, res, next) {
    var business;
    try {
        business = JSON.parse(req.body.business);
    } catch (e) {
        return next(new ValidationError("registration field must be a valid json object"));
    }

    if(!req.user || req.user.userRoles.length !== 1 || req.user.userRoles[0].role !== Const.UserRole.INDIVIDUAL_USER) {
        return next(new UnauthorizedError('You are not authorized add business to your account'));
    };
    async.waterfall([
        function (cb) {
            if (req.files && req.files.businessImage) {
                awsHelper.uploadPhotoToS3(req.files.businessImage, cb.wrap(function (url) {
                    business.picture = url;
                    cb();
                }));
            } else {
                cb();
            }
        }, function (cb) {
            BusinessService.create(business, cb)
        }, function (business, cb) {
            var user = {userRoles: [
                {
                    championId: req.user.userRoles[0].championId,
                    role: req.user.userRoles[0].role
                }
            ]};
            user.userRoles.push({
                businessId: business.id,
                role: Const.UserRole.BUSINESS_ADMIN
            });
            UserService.update(req.user.id, user, cb);
        }, function (user) {
            res.json(helper.mapUser(user));
        }
    ], next)
}

module.exports = {
    registerUser: registerUser,
    verifyEmail: verifyEmail,
    verifyEmailStop: verifyEmailStop,
    login: login,
    switchRole: switchRole,
    getMyUserProfile: getMyUserProfile,
    updateMyUserProfile: updateMyUserProfile,
    recoverPassword: recoverPassword,
    resetForgottenPassword: resetForgottenPassword,
    resetPassword: resetPassword,
    revokeAccessToken: revokeAccessToken,
    refreshAccessToken: refreshAccessToken,
    getMyActions: getMyActions,
    addPlatformAdmin: addPlatformAdmin,
    getAllPlatformAdmins: getAllPlatformAdmins,
    deletePlatformAdmin: deletePlatformAdmin,
    verifyPlatformAdmin: verifyPlatformAdmin,
    updatePlatformAdmin: updatePlatformAdmin,
    addSocialConnection: addSocialConnection,
    removeSocialConnection: removeSocialConnection,
    addBusiness: addBusiness
};

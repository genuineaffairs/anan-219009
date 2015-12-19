/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */

/**
 * Represents the schema for User.
 *
 * Changes in version 1.1:
 * - Added email verification logic.
 *
 * Changes in version 1.2 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-220] Add subscribedToNews
 * - [PMP-233] Add signedUpDate and verifiedDate
 *
 * Changes in 1.3 (Authentication and Social Media Integration enhancement):
 * - [PMP-242] Add linkedSocialNetworks (support multiple social networks)
 * - [PMP-246] Add autoShare
 * - [PMP-164] Remove isFirstNamePublic
 *
 * Changes in 1.4 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2):
 * - [PMP-237] Moved picture, isPicturePUblic and autoShare to Champion schema
 * - [PMP-247] Added isStopVerificationReminder
 *
 * @author TCSASSEMBLER
 * @version 1.4
 */
'use strict';

var mongoose = require('mongoose'),
    _ = require('underscore'),
    Const = require("../Const"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

module.exports = new Schema({
    firstName: {type: String, required: true},
    lastName: String,
    email: String,
    email_lowered: String,
    location: String,
    isLastNamePublic: {type: Boolean, default: true},
    isEmailPublic: {type: Boolean, default: true},
    isLocationPublic: {type: Boolean, default: true},
    isStopVerificationReminder: {type: Boolean, default: false},
    subscribedToNews: {type: Boolean, default: false},
    passwordHash: {type: String},
    userRoles: [{
        businessId: ObjectId,
        championId: ObjectId,
        role: {
            type: String,
            enum: _.values(Const.UserRole)
        }
    }],
    linkedSocialNetworks: [
        {
            socialUserId: {type: String, required: true},
            socialNetwork: {type: String, enum: _.values(Const.SocialNetwork), required: true},
            accessToken: {type: String, required: true}
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpired: Boolean,
    verifyEmailText: String,
    verifyEmailExpirationDate: {type: Date},
    signedUpDate: {type: Date, required: true, default: Date.now},
    verifiedDate: {type: Date}
});

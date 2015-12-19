/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Migration script for assembly https://www.topcoder.com/challenge-details/30052379/?type=develop
 *
 * This Script Applies following changes
 * - Adds Champion Record to existing users with role 'INDIVIDUAL_USER'
 * - Adds Champion Role and adds champion record to users with role 'BUSINESS_ADMIN'
 *
 * @author TCSASSEMBLER
 * @version 1.0
 */
"use strict";

require("../src/common/function-utils");
var Const = require("../src/Const");
var _ = require('underscore');
var async = require('async');
var User = require('../src/models').User;
var ActionRecord = require('../src/models').ActionRecord;
var Business = require('../src/models').Business;
var GiftCardOffer = require('../src/models').GiftCardOffer;
var Champion = require('../src/models').Champion;

async.series([
    moveChampionRecords
], function (err) {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log("\nSUCCESS");
    process.exit();
});

/**
 * Fetches all existing champion records and move champion specific records to Champion Schema.
 *
 * @param {function(Error)} callback the callback
 */
function moveChampionRecords(callback) {

    async.waterfall([
        function (cb) {
            User.find({userRoles: {
                $elemMatch: {
                    "$or": [
                            {role: Const.UserRole.INDIVIDUAL_USER},
                            {role: Const.UserRole.BUSINESS_ADMIN}
                        ]
                    }
                }
            }, cb)
        }, function (users, cb) {
            async.each(users, _updateUser, cb);
        }
    ], function (err) {
        if (err) {
            console.log("Error moving Champion Records")
        } else {
            console.log("Champions specific records are moved to Champion Schema.")
        }
        callback(err);
    });
}

function _updateUser(userCursor, cb) {
    var user = userCursor.toJSON();
    var championRole = _.find(user.userRoles, function(userRole) {return userRole.role === Const.UserRole.INDIVIDUAL_USER});
    if(!championRole) {
        championRole = {
            role: Const.UserRole.INDIVIDUAL_USER
        };
        user.userRoles.push(championRole);
    }

    var shouldCallback = true;
    if(!championRole.championId) {
        shouldCallback = false;
        Champion.findOneAndUpdate(
            {linkedUserId: user.id},
            {
                picture: String(user.picture),
                isPicturePublic: user.isPicturePublic,
                autoShare: user.autoShare,
                linkedUserId: user.id
            },
            {upsert: true},
            function (err, champion) {
                championRole.championId = champion._id;
                User.update({email: user.email}, user, {}, cb);
            }
        );
    }
    if(shouldCallback) cb();
}

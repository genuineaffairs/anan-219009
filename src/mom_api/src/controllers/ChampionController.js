/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */

/**
 * This controller exposes REST actions for champion.
 *
 * @author TCSASSEMBLER
 * @version 1.0
 */
'use strict';

var _ = require("underscore");
var async = require("async");
var helper = require("../common/helper");
var Const = require("../Const");
var validate = require("../common/validator").validate;
var awsHelper = require("../common/awsHelper");
var NotFoundError = require("../common/errors").NotFoundError;
var ChampionService = require("../services/ChampionService");
var UserService = require("../services/UserService");

/**
 * Get champion or return error if not found
 * @param {ObjectId} championId the champion id
 * @param {function(Error)} callback the callback function with arguments
 * - the error
 * @private
 */
function _getChampion(championId, callback) {
    ChampionService.get(championId, callback.wrap(function (result) {
        if (!result) {
            return callback(new NotFoundError("Champion not found"));
        }
        callback(null, result);
    }));
}

/**
 * Get champion details of current user
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function getMyChampionProfile(req, res, next) {
    _getChampion(req.user.championId, next.wrap(function (result) {
        res.json(result);
    }));
}

/**
 * Update champion details of current user
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function updateMyChampionProfile(req, res, next) {
    var values = req.body;
    var champion;
    async.waterfall([
        function (cb) {
            _getChampion(req.user.championId, cb);
        }, function (result, cb) {
            champion = result;
            var fields = ['isPicturePublic', 'autoShare'];
            values = _.pick(values, fields);
            fields.forEach(function(field) { values[field] = values[field] ? values[field] === 'true' : undefined; });
            if (req.files && req.files.image) {
                awsHelper.uploadPhotoToS3(req.files.image, cb.wrap(function (url) {
                    values.picture = url;
                    cb();
                }));
            } else {
                cb();
            }
        }, function (cb) {
            ChampionService.update(champion.id, values, cb);
        }, function (result) {
            res.json(result);
        }
    ], next);
}

module.exports = {
    getMyChampionProfile: getMyChampionProfile,
    updateMyChampionProfile: updateMyChampionProfile
};

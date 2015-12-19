/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */
/**
 * This service provides methods to manage Champions.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */
'use strict';

var _ = require('underscore');
var async = require('async');
var config = require('config');
var braintree = require("braintree");
var validate = require("../common/validator").validate;
var logging = require("../common/logging");
var helper = require("../common/helper");
var BadRequestError = require("../common/errors").BadRequestError;
var Champion = require('../models').Champion;

/**
 * Create a champion.
 * @param {Champion} champion the champion
 * @param {function(Error, Champion)} callback the callback function with arguments
 * - the error
 * - the created object
 */
function create(champion, callback) {
    var error = validate(
        {champion: champion},
        {
            champion: {
                __obj: true,
                picture: "ShortString?",
                isPicturePublic: "bool?",
                autoShare: "bool?",
                linkedUserId: "ObjectId?"
            }
        });
    if (error) {
        return callback(error);
    }
    Champion.create(champion, function (err, result) {
        callback(err, _.toJSON(result));
    });
}

/**
 * Get a champion.
 * @param id {String} the champion id
 * @param {function(Error, Champion)} callback the callback function with arguments
 * - the error
 * - the found object or null if not found
 */
function get(id, callback) {
    var error = validate(
        {id: id},
        {id: "ObjectId"});
    if (error) {
        return callback(error);
    }
    Champion.findById(id).exec(function (err, result) {
        callback(err, _.toJSON(result));
    });
}


/**
 * Update champion.
 * @param {ObjectId} id the champion id
 * @param {Champion} champion the values to update
 * @param {function(Error, Champion)} callback the callback function with arguments
 * - the error
 * - the updated object
 */
function update(id, champion, callback) {
    var error = validate(
        {id: id, champion: champion},
        {
            id: "ObjectId",
            champion: {
                __obj: true,
                picture: "ShortString?",
                isPicturePublic: "bool?",
                autoShare: "bool?",
                linkedUserId: "ObjectId?"
            }
        });
    if (error) {
        return callback(error);
    }
    var existing;
    async.waterfall([
        function (cb) {
            helper.ensureExists(Champion, id, cb);
        }, function (result, cb) {
            existing = result;
            _.extend(existing, champion);
            existing.save(cb.errorOnly());
        }
    ], function (err) {
        callback(err, _.toJSON(existing));
    });
}

/**
 * Delete champion.
 * @param {ObjectId} id the champion id
 * @param {function(Error)} callback the callback function with arguments
 * - the error
 */
function remove(id, callback) {
    var error = validate(
        {id: id},
        {id: "ObjectId"});
    if (error) {
        return callback(error);
    }

    var champion;
    async.waterfall([
        function (cb) {
            helper.ensureExists(Champion, id, cb);
        }, function (result, cb) {
            champion = result;
            champion.remove(cb);
        }
    ], callback.errorOnly());
}

module.exports = {
    create: logging.createWrapper(create, {
        input: ["champion"],
        output: ["champion"],
        signature: "ChampionService#create"
    }),
    get: logging.createWrapper(get, {input: ["id"], output: ["champion"], signature: "ChampionService#get"}),
    update: logging.createWrapper(update, {
        input: ["id", "champion"],
        output: ["champion"],
        signature: "ChampionService#update"
    }),
    delete: logging.createWrapper(remove, {input: ["id"], output: [], signature: "ChampionService#remove"})
};

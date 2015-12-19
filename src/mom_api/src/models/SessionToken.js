/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */

/**
 * Represents the schema for Session Token.
 *
 * Changes in 1.1 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - Added role
 *
 * @author TCSASSEMBLER
 * @version 1.1
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    _ = require('underscore'),
    Const = require("../Const");

module.exports = new Schema({
    userId: {type: ObjectId, required: true},
    token: {type: String, unique: true, index: true},
    role: {type: String, enum: _.values(Const.UserRole)},
    expirationDate: {type: Date, required: true}
});

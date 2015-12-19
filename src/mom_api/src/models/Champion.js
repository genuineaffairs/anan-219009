/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */

/**
 * Represents the schema for Champion.
 *
 * @author TCSASSEMBLER
 * @version 1.0
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var ChampionSchema = new Schema({
    picture: String,
    isPicturePublic: {type: Boolean, default: true},
    autoShare: {type: Boolean, default: false},
    linkedUserId: ObjectId
});

ChampionSchema.plugin(require('mongoose-paginate'), null);

module.exports = ChampionSchema;

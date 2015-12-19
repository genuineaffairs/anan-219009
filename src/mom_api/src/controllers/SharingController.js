/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */

/**
 * This controller exposes REST actions for sharing features
 *
 * @author TCSASSEMBLER
 * @version 1.0
 */
'use strict';

var _ = require('underscore');
var ValidationError = require("../common/errors").ValidationError;
var validate = require("../common/validator").validate;
var SharingService = require("../services/SharingService");

/**
 * Share content to social network
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
function share(req, res, next) {
    var content = req.body.content;
    var type = req.body.type;
    var error = validate({content: content, socialNetwork: type},
        {content: {
            message: "ShortString",
            link: "ShortString?",
            caption: "ShortString?",
            image: "ShortString?",
            description: "ShortString?",
            name: "ShortString?"
        }, socialNetwork: "SocialNetwork"});
    if (error) {
        return next(error);
    }
    var linkedSocialNetwork = _.findWhere(req.user.linkedSocialNetworks, {socialNetwork: req.body.type});
    if (!linkedSocialNetwork) {
        return next(new ValidationError("not linked"));
    }

    SharingService.shareContent(linkedSocialNetwork.accessToken, linkedSocialNetwork.socialNetwork, content, next.wrap(function () {
        res.end();
    }));
}

module.exports = {
    share: share
};
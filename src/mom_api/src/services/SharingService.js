/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */
/**
 * This service provides methods to share content to social networks.
 *
 * Changes in 1.1 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-247] Updated to share more rich content
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */
'use strict';


var config = require('config');
var fbgraph = require('fbgraph');
var Twitter = require('twitter');
var Linkedin = require('node-linked-in');
var logging = require("../common/logging");
var validate = require("../common/validator").validate;
var Const = require("../Const");
var async = require("async");
var helper= require("../common/helper");
/**
 * Share content to social network
 * @param accessToken the access token to use
 * @param socialNetwork the social network to use
 * @param content the content
 * @param callback the callback
 */
function shareContent(accessToken, socialNetwork, content, callback) {
    var error = validate(
        {socialNetwork: socialNetwork, accessToken: accessToken, content: content},
        {socialNetwork: "SocialNetwork", accessToken: "ShortString",
            content: {
                message: "ShortString",
                link: "ShortString?",
                caption: "ShortString?",
                image: "ShortString?",
                description: "ShortString?",
                name: "ShortString?"
            }
        });
    if (error) {
        return callback(error);
    }
    async.waterfall([
        function (cb) {
            if(content.link) helper.shortenLink(config.SHARE_URL + '' + content.link, cb);
            else helper.shortenLink(config.SHARE_URL, cb);
        }, function (url, callback) {
            switch (socialNetwork) {
                case Const.SocialNetwork.FACEBOOK:
                    fbgraph.post("me/feed?access_token=" + accessToken, {
                        message: content.message,
                        picture: content.image,
                        link: url,
                        name: content.name,
                        description: content.description,
                        caption: content.caption
                    }, callback.errorOnly());
                    return;
                case Const.SocialNetwork.TWITTER:
                    var plainAuth = new Buffer(accessToken, 'base64').toString().split(':');
                    var twitterClient = new Twitter({
                        consumer_key: config.TWITTER_CONSUMER_KEY,
                        consumer_secret: config.TWITTER_CONSUMER_SECRET,
                        access_token_key: plainAuth[0],
                        access_token_secret: plainAuth[1]
                    });
                    twitterClient.post('statuses/update', {status: content.message + '' + url}, callback.errorOnly());
                    return;
                case Const.SocialNetwork.LINKEDIN:
                    var linkedin = new Linkedin();
                    linkedin.authenticate({
                        token: accessToken
                    });
                    linkedin.shares.add({
                        data: {
                            comment: content.message,
                            visibility: {
                                code: "anyone"
                            },
                            content: {
                                "submitted-url": url,
                                "title": content.name,
                                "description": content.description,
                                "submitted-image-url": content.image
                            }
                        }
                    }, callback.errorOnly());
                    return;
                default:
                    callback(new Error("Sharing not supported"));
            }
        }
    ], callback);

}

module.exports = {
    shareContent: logging.createWrapper(shareContent, {
        input: ["accessToken", "socialNetwork", "content"],
        output: [],
        signature: "SharingService#shareContent"
    })
};

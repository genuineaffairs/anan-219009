/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */
/**
 * Represents the grunt file
 *
 * Changes in version 1.2:
 *  - Integrated with braintree lib.
 *
 * Changes in version 1.3
 * - Add angular-notify library
 *
 * Changes in version 1.4 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-159] Add crumble library
 * - Add nouislider library
 *
 * @author TCSASSEMBLER
 * @version 1.4
 */
"use strict";

module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({

        concat: {
            lib: {
                src: [
                    "app/lib/jquery/*.js",
                    "app/lib/angular/angular.js",
                    "app/lib/angular/angular-*.js",
                    "app/lib/angular-notify/angular-*.js",
                    "app/lib/angular/ng-*.js",
                    "app/lib/oauth.min.js",
                    "app/lib/underscore-min.js",
                    "app/lib/moment.min.js",
                    "app/lib/braintree.js",
                    "app/lib/ng-device-detector.min.js",
                    "app/lib/crumble.js",
                    "app/lib/nouislider/nouislider.min.js",
                    "app/lib/angulartics.min.js",
                    "app/lib/angulartics-google-analytics.min.js"
                ],
                dest: "app/prod/lib.js"
            },
            app: {
                src: ["app/js/config-local.js", "app/js/**/*.js"],
                dest: "app/prod/app.js"
            }
        },

        jshint: {
            files: ["app/js/**/*.js"],
            options: {
                jshintrc: true
            }
        },

        watch: {
            scripts: {
                files: ["app/js/**/*.js"],
                tasks: [/*"jshint",*/ "concat"],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        }
    });

    // Plugins
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Tasks
    //uncomment jshint if you fix all errors
    //currently there is too many errors
    grunt.registerTask("default", [/*"jshint",*/ "concat"]);
    grunt.registerTask("dev", [/*"jshint",*/ "concat", "watch"]);
};


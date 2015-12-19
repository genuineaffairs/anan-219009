/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */
/**
 * Represents the grunt file
 * @author TCSASSEMBLER
 * @version 1.5
 *
 * Changes in 1.1
 *  - Included files for mobile gift card flow
 *
 * Changes in 1.2
 *  - Included files for mobile gifting flow
 *
 * Changes in version 1.3 (Project Mom and Pop - MiscUpdate5):
 *  - [PMP-206] Add javascript file app/components/filters/multiline-filter.js
 *
 * Changes in version 1.4 (Project Mom and Pop - Release Fall 2015 Assembly):
 *  - Add nouislider library
 *  
 * Changes in 1.5 (Authentication and Social Media Integration enhancement):
 * - [PMP-246] Add auto-share-directive.js
 */
'use strict';

module.exports = function (grunt) {

    // Configuration
    grunt.initConfig({
        distdir: 'dist',
        src: {
            css: [
                'vendor/bootstrap/bootstrap.min.css',
                'vendor/angular-loading-bar/loading-bar.min.css',
		'vendor/nouislider/nouislider.min.css',
                'app/assets/css/icons-sprites.css',
                'app/assets/css/screen.css'
            ],
            vendorjs: [
                'vendor/jquery/*.js',
                'vendor/slick-jquery/*.js',
		'vendor/nouislider/nouislider.min.js',
                'vendor/angular/angular.min.js',
                'vendor/angular/angular-*.js',
                'vendor/angular-loading-bar/*.js',
                'vendor/angular-ui/*.js',
                'vendor/bootstrap/*.js',
                'vendor/*.js'
            ],
            appjs: [
                'app/components/components.js',
                'app/components/config.js',
                'app/components/directives.js',
                'app/components/directives/tapstate-directive.js',
                'app/components/directives/email-or-phone-directive.js',
                'app/components/directives/integer-check-directive.js',
                'app/components/directives/auto-share-directive.js',
		'app/components/filters/multiline-filter.js',
                'app/components/filters/time-remaining-filter.js',
                'app/components/gauge/gauge-directive.js',
                'app/components/gauge/gauge-controller.js',
                'app/components/modals/modal-complete-registration-controller.js',
                'app/components/modals/modal-controller.js',
                'app/components/modals/modals-consolidated-controller.js',
                'app/components/search/search-controller.js',
                'app/components/services/*.js',
                'app/champion/gift-card-details/gift-card-details.js',
                'app/champion/gift-card-details/gift-card-details-controller.js',
                'app/champion/open-gift/open-gift.js',
                'app/champion/open-gift/open-gift-controller.js',
                'app/champion/send-gift/send-gift.js',
                'app/champion/send-gift/twitter-select-controller.js',
                'app/champion/send-gift/send-gift-controller.js',
                'app/champion/my-cart/my-cart.js',
                'app/champion/my-cart/my-cart-controller.js',
                'app/champion/payment/payment.js',
                'app/champion/payment/payment-controller.js',
                'app/champion/founder-shares/founder-shares.js',
                'app/champion/founder-shares/founder-shares-controller.js',
                'app/champion/redeem/redeem.js',
                'app/champion/redeem/redeem-controller.js',
                'app/champion/show-route/show-route.js',
                'app/champion/show-route/show-route-controller.js',
                'app/champion/champion.js',
                'app/common/contact-support/contact-support.js',
                'app/common/contact-support/contact-support-controller.js',
                'app/common/history/history.js',
                'app/common/history/history-controller.js',
                'app/common/login/login.js',
                'app/common/login/login-controller.js',
                'app/common/menu/menu-controller.js',
                'app/common/offers/offers.js',
                'app/common/offers/offers-controller.js',
                'app/common/offer-details/offer-details.js',
                'app/common/offer-details/offer-details-controller.js',
                'app/common/reset-password/reset-password.js',
                'app/common/reset-password/reset-password-controller1.js',
                'app/common/reset-password/reset-password-controller2.js',
                'app/common/sign-up/signup.js',
                'app/common/sign-up/champion/sign-up-champion-controller.js',
                'app/common/sign-up/champion/sign-up-champion.js',
                'app/common/sign-up/founder/sign-up-founder-controller.js',
                'app/common/sign-up/founder/sign-up-founder.js',
                'app/common/sign-up/signup-controller.js',
                'app/common/sign-up/verify-email/verify-email.js',
                'app/common/sign-up/verify-email/verify-email-controller.js',
                'app/common/static/static.js',
                'app/common/static/static-controller.js',
                'app/common/common.js',
                'app/founder/home/founder-home.js',
                'app/founder/home/founder-home-controller.js',
                'app/founder/redeem/founder-redeem.js',
                'app/founder/redeem/founder-redeem-controller.js',
                'app/founder/founder.js',
                'app/app.js',
                'app/app-controller.js'],
            apptpl: [
                'app/components/**/*.html',
                'app/common/**/*.html',
                'app/champion/**/*.html',
                'app/founder/**/*.html'
            ]
        },

        jshint: {
            files: ['app/**/*.js'],
            options: {
                jshintrc: true
            }
        },

        clean: [
            '<%= distdir %>'
        ],

        html2js: {
            app: {
                options: {
                    base: 'app',
                    module: 'templates.app'
                },
                src: ['<%= src.apptpl %>'],
                dest: '<%= distdir %>/templates-app.js'
            }
        },
        copy: {
            assets: {
                files: [{
                    cwd: 'app/assets',
                    src: ['data/**/*', 'i/**/*', 'svg/**/*', 'css/screen.css.map'],
                    dest: '<%= distdir %>/assets/',
                    expand: true
                }]
            },
            appjs: {
                files: [{
                    src: ['<%= src.appjs %>'],
                    dest: '<%= distdir %>/',
                    expand: true
                }]
            }
        },
        concat: {
            css: {
                src: ['<%= src.css %>'],
                dest: '<%= distdir %>/assets/css/app.css'
            },
            vendorjs: {
                src: ['<%= src.vendorjs %>'],
                dest: '<%= distdir %>/assets/lib.js'
            },
            appjs: {
                    src: ['<%= src.appjs %>'],
                    dest: '<%= distdir %>/app.js'
            }
        },
        uglify: {
            appjs: {
                src: ['<%= distdir %>/templates-app.js', '<%= distdir %>/app.js'],
                dest: '<%= distdir %>/app.min.js'
            }
        },
        index: {
            dev: {
                dir: '<%= distdir %>',
                cwd: '<%= distdir %>',
                src: ['templates-app.js', '<%= src.appjs %>']
            },
            build: {
                dir: '<%= distdir %>',
                cwd: '<%= distdir %>',
                src: ['app.min.js']
            }
        },
        delta: {
            options: {
                livereload: true
            },

            all: {
                files: 'app/**/*',
                tasks: ['dev'],
                options: {
                    livereload: false
                }
            }
        }
    });

    // Plugins

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html2js');

    // Tasks
    //uncomment jshint if you fix all errors
    //currently there is too many errors
    grunt.registerTask('default', ['build']);
    grunt.registerTask('dev', [/*'jshint',*/ 'clean', 'html2js', 'copy:assets', 'concat:css', 'concat:vendorjs', 'copy:appjs', 'index:dev']);

    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['dev', 'delta']);

    grunt.registerTask('build', [/*'jshint',*/ 'clean', 'html2js', 'copy:assets', 'concat:css', 'concat:vendorjs', 'concat:appjs', 'uglify:appjs', 'index:build']);

    grunt.registerMultiTask('index', 'Process index.html template', function () {
        var dirRE = new RegExp('^(' + grunt.config('distdir') + ')\/', 'g');
        var jsFiles = this.filesSrc.map(function (file) {
            return file.replace(dirRE, '');
        });
        grunt.file.copy('app/index.html', this.data.dir + '/index.html', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles
                    }
                });
            }
        });
    });
};


/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Static Page Service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('StaticPageService', ['common', function (common) {

	var service = {};

	/**
	 * Get all static pages.
	 */
	service.getAllPages = function() {
	    var req = {
                method: 'GET',
                url: '/staticPages'
            };
            return common.makeRequest(req);
	};

	/**
	 * Get a page by its name.
	 * @param {String} name the page name
	 */
	service.getPageByName = function(name) {
	    var req = {
                method: 'GET',
                url: '/staticPages/' + name
            };
            return common.makeRequest(req);
	};

	/**
	 * Save a page. The admin must give his password to approve.
	 * @param {StaticPage} page the page
	 * @param {String} password the admin password
	 */
	service.savePage = function(page, password) {
	    var req = {
		method: 'PUT',
		url: '/staticPages/' + page.name,
		data: {
		    page: page,
		    password: password
		}
	    };
	    return common.makeRequest(req);
	};

	return service;
    }]);

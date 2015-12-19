/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents angular filter to format a multiline string by replacing
 * LF characters by <br/> tags.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .filter('multiline', ['$sce', function ($sce) {
	    return function(input) {
		return $sce.trustAsHtml(input.replace('\n', '<br/>\n'));
	    };
	}]);
})();

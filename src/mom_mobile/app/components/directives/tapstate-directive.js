/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents angular directives
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .directive('momTapstate', momTapstate);

    //angular directive to add hover class on tap
    function momTapstate() {
        return {
            restrict: 'A',
            link: function (scope, el) {
                var _ = $(el)
                    .on('touchstart mousedown', function () {
                        _.addClass('hover');
                    })
                    .on('touchend  mouseup', function () {
                        _.removeClass('hover');
                    })
            }
        }
    }
})();

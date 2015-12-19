/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents angular filter to to format remaining time in format XX days YYh
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .filter('timeRemaining', timeRemaining);


//format remaining time in format XX days YYh
    function timeRemaining() {
        return function (input, format) {
            if (!input) {
                return "-";
            }
            var diff = new Date(input).getTime() - new Date().getTime();
            if (diff <= 0) {
                return "Expired"
            }
            var totalMinutes = diff / 1000 / 60;
            if (totalMinutes < 60) {
                if (totalMinutes < 1) {
                    return "< 1 min";
                }
                return Math.floor(totalMinutes) + " min";
            }
            var totalHours = totalMinutes / 60;
            var days = Math.floor(totalHours / 24);
            var hours = Math.floor(totalHours % 24);
            var ret = "";
            if (days) {
                if (days <= 1) {
                    return "today"
                } else if (days > 1 && days <= 2) {
                    return "tomorrow";
                } else if (format === 'short') {
                    return "in " + days + " days";
                }
                ret = days + " day";
                if (days > 1) {
                    ret += "s";
                }
                ret += " ";
            }
            if (hours) {
                ret += hours + "h";
            }
            return ret;
        }
    }
})();
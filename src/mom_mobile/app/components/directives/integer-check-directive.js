/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents angular directive to validate for integer and not float
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .directive('strictInteger', strictInteger);

    //angular directive to check if the given input an integer and not float
    function strictInteger() {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.strictInteger = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }

                    var n = Number(viewValue);

                    //Check if n is a number and is not a float
                    return ( n === +n && n === (n|0) );

                };
            }
        };
    }
})();

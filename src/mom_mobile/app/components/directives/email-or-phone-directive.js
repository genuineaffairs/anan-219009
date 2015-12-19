/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents angular directive to validate email or phone number
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .directive('momEmailOrPhone', momEmailOrPhone);

    //angular directive to check if the given input is email or phone number
    function momEmailOrPhone() {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.emailOrPhone = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }

                    //Check if the input is in valid email format
                    function validateEmail(email) {
                        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                        return re.test(email);
                    }

                    //if contains any letter or @ character, assume this is an email
                    if (/[a-zA-Z@]/.test(viewValue) && !validateEmail(viewValue)) {
                        return false;
                    }
                    return true;
                };
            }
        };
    }
})();

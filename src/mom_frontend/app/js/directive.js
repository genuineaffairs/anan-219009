/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application directives.
 *
 * @version 1.5
 * @author TCSASSEMBLER
 *
 * Changes in 1.1:
 * 1. add ngcEmailOrPhone
 *
 * Changes in version 1.2
 * 1. Restrict max number to two decimal places only
 *
 * Changes in version 1.3 (Project Mom and Pop - Release Fall 2015 Assembly):
 * 1. Add slider directive
 *
 * Changes in 1.4 (Authentication and Social Media Integration enhancement):
 * - [PMP-246] Add directives: ngcAutoShare, ngcFireAutoShare
 *
 * Changes in version 1.5 (FOUNDERSHARE (AKA PMP) - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2)
 * - [PMP-237] AutoShare flag moved to champion schema
 *
 */
'use strict';

var app = angular.module("app");

//Only Number
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9+]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});

//Only Dollar
app.directive('dollarOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9.$+]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(Number(transformedInput));
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});

app.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);


//Max Number
app.directive('maxNumber', function ($filter) {
    return {
        require: 'ngModel',
        scope: {
            max: '=maxNumber',
            min: '=minNumber',
            model: '=ngModel'
        },
        link: function (scope, element, attrs, modelCtrl) {
            element.on('keydown', function () {
                setTimeout(function () {
                    scope.$apply(function () {
                        if (scope.model > scope.max) {
                            scope.model = $filter('number')(scope.max, 2);
                        }
                        if (scope.min && scope.model < scope.min) {
                            scope.model = scope.min;
                        }
                        scope.model = Number($filter('number')(scope.model, 2));
                    });
                }, 0);
            });
        }
    };
});


// set percent progress bar for gift card
app.directive('progress', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModelCtrl) {
            var val = attrs['progress'].split(',');
            var progress = isNaN(Number(val[0])) ? 0 : Number(val[0]);
            var aProgress = isNaN(Number(val[1])) ? 0 : Number(val[1]);
            var percent = (progress / aProgress) * 100;
            var rotageElement1 = element.find('.circle .mask.full');
            var rotageElement2 = element.find('.circle .fill');
            rotageElement1.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
            rotageElement2.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
        }
    }
});

// set position for modal
app.directive('initModal', function ($window) {
    return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            var w = angular.element($window);
            var mt = (w.height() - element.height()) / 2;
            element.css({'margin-top': mt})
        }
    }
});

// trigger submit on given form if element is clicked
app.directive('ngcSubmitForm', function ($window) {
    return {
        restrict: 'EA',
        scope: {
            form: "=ngcSubmitForm",
            onlyMark: "=onlyMark"
        },
        link: function (scope, element, attrs) {
            $(element).click(function () {
                $(scope.form).submit(function () {
                    return false;
                });
                setTimeout(function () {
                    var $form = $(scope.form);
                    $form.addClass("ngc-submitted");
                    if (!scope.onlyMark) {
                        $form.trigger("submit");
                    }
                });
            })
        }
    }
});

//validator for date in format e.g. 01/01/2015
app.directive('ngcDate', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.date = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }
                var date = moment(viewValue, "M/D/YYYY", true);
                return date.isValid();
            };
        }
    };
});

//validator for time in format e.g. 10:00 PM
app.directive('ngcTime', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.time = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }
                var date = moment(viewValue, "h:mm A");
                if (date.isValid()) {
                    //check if date ends with AM or PM
                    //moment allows A or P
                    viewValue = viewValue.trim();
                    return /AM$/i.test(viewValue) || /PM$/i.test(viewValue);
                }
                return false;
            };
        }
    };
});

//include html from wordpress url
app.directive('ngcWpInclude', ["$http", function ($http) {
    return {
        scope: {
            url: "=ngcWpInclude"
        },
        link: function (scope, element) {
            $http.get(scope.url).then(function (response) {
                var iframe = document.createElement('iframe');
                $(element).append(iframe);
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(response.data);
                iframe.contentWindow.document.close();
                var $frame = $(element).find('iframe');
                $frame.attr('frameborder', '0');
                $frame.attr('scrolling', 'no');
                $frame.css('width', '960px');
                $frame.css('height', '1000px');
                $frame.on('load', function(){
                    $frame.contents().find('head').prepend($('<link href="'+ window.location.origin +'/css/screen.css" rel="stylesheet" type="text/css">'));
                    $frame.show();
                    $frame.css('height', $frame.contents().outerHeight());
                });
            });
        }
    };
}]);


//validator for email address or phone
app.directive('ngcEmailOrPhone', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.emailOrPhone = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }
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
});

// Slider directive
app.directive('slider', function () {
    return {
        require: 'ngModel',
        scope: {
	    max: '=max',
	    min: '=min',
	    model: '=ngModel'
        },
        link: function(scope, element, attrs, modelCtrl) {
	    //construct nonlinear slider ranges
	    var min = parseFloat(scope.min),
		max = Math.floor(parseFloat(scope.max));
	    var range = {};
	    if (max > 1 && min < 1) {
                range.min = [min, 1];
	    } else if (min < 10) {
		range.min = [min, 1];
	    } else if (min < 100) {
		range.min = [min, 5];
	    } else {
		range.min = [min, 10];
	    }
	    if (max > 10 && min < 10) {
		range['10%'] = [10, 1];
	    }
	    if (max > 100 && min < 100) {
                range['50%'] = [100, 5];
	    }
	    if (max > 500 && min < 500) {
                range['80%'] = [500, 10];
	    }
	    range.max = [max];
	    //Create Slider
	    noUiSlider.create(element[0], {
                start: scope.model,
                range: range,
                connect: "lower"
	    });
	    
	    //Setup binding to ngModel
	    modelCtrl.$render = function() {
                var val = parseFloat(modelCtrl.$viewValue);
                var oldVal = parseFloat(element[0].noUiSlider.get());
                if (oldVal !== val) {
                    element[0].noUiSlider.set(val);
                }
	    };
	    element[0].noUiSlider.on('slide', function() {
                setTimeout(function () {
		    scope.$apply(function () {
                        var val = parseFloat(element[0].noUiSlider.get());
                        scope.model = val;
		    });
                });
	    });
        }
    };
});


//share buttons
app.directive('ngcAutoShare', ["SharingService", "storage", "$rootScope", "util", function (SharingService, storage, $rootScope, util) {
    return {
        scope: {
            shareCategory: "=shareCategory",
            shareText: "=shareText",
            shareTextTw: "=shareTextTw",
            shareDetails: "=shareDetails"

        },
        templateUrl: "partials/module/auto-share-icons.html",
        link: function (scope) {
            scope.active = {};
            var user = $rootScope.loggedUser;
            if (user.champion.autoShare) {
                _.each(user.linkedSocialNetworks, function (network) {
                    scope.active[network.socialNetwork] = true;
                });
            }
            scope.shareGoogle = function () {
                $rootScope.openShareWindow("googleplus", null, "");
            };
            //toggle button press
            scope.toggle = function (type) {
                if (scope.active[type]) {
                    delete scope.active[type];
                    return;
                }
                var connection = _.findWhere(user.linkedSocialNetworks, {"socialNetwork": type});
                if (connection) {
                    scope.active[type] = true;
                } else {
                    util.connectToSocialNetwork(type).then(function () {
                        scope.active[type] = true;
                        user.linkedSocialNetworks.push({
                            socialNetwork: type
                        });
                        storage.storeCurrentUserProfile(user, true);
                    });
                }
            };
            scope.$on('fireShare', function () {
                _.each(scope.active, function (val, type) {
                    var content = scope.shareDetails ? scope.shareDetails : {};
                    content.message = type == "TWITTER" ? scope.shareTextTw : scope.shareText;
                    SharingService.share(type, content);
                });
            });
        }
    };
}]);

//on click send event to ngcAutoShare directive
app.directive('ngcFireAutoShare', ["$rootScope", function ($rootScope) {
    return {
        link: function (scope, el) {
            el.click(function () {
                $rootScope.$broadcast("fireShare");
            });
        }
    };
}]);
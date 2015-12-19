/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents angular directives
 *
 * Changes in version 1.1:
 * - Fix fallback to upload method if getUserMedia fails
 *
 * Changes in version 1.2 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - Add slider directive
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */

(function () {
    'use strict';

    angular
        .module('app.components')
        .directive('captureQrCode', captureQrCode)
	.directive('maxNumber', maxNumber)
	.directive('slider', slider);

    captureQrCode.$inject = ['$rootScope', '$interval', 'appConfig'];

    //scan QR code for founder user
    //it will broadcast 'qrCode' event if qr code is scanned successfully
    function captureQrCode($rootScope, $interval, appConfig) {
        return {
            link: function (scope) {
                qrcode.callback = null;
                // Check browser support getUserMedia function
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                scope.userMedia = Boolean(navigator.getUserMedia);
                if (appConfig.FORCE_QR_FILE_UPLOAD) {
                    scope.userMedia = false;
                }
                // Camera QR code capture routine
                function videoCapture() {
                    // try to capture camera
                    function startVideo(sourceId) {
                        navigator.getUserMedia({
                            video: {optional: [{sourceId: sourceId}]},
                            audio: false
                        }, initVideoCapture, videoError);
                    }

                    // init video playback
                    function initVideoCapture(stream) {
                        try {
                            localStream = stream;
                            video.src = window.URL.createObjectURL(stream);
                            video.play();

                            // position video element in viewport
                            setTimeout(function () {
                                $(video).css({'margin-top': (180 - $(video).height()) / 2});
                                timer = $interval(scan, 200);
                            }, 100);

                        } catch (e) {
                            scope.userMedia = false;
                        }
                    }

                    // capture camera error
                    function videoError() {
                        scope.userMedia = false;
			scope.$apply();
                    }

                    // scan qr code
                    function scan() {
                        context.drawImage(video, 0, 0, 320, 360);
                        try {
                            //will throw error if qr code is invalid
                            qrcode.decode();
                        } catch (e) {
                        }
                    }

                    // qr scanned successfully
                    function scanSuccess(res) {
                        $interval.cancel(timer);
                        $rootScope.$broadcast("qrCode", res);
                        localStream.stop();
                        video.src = '';
                    }

                    qrcode.callback = scanSuccess;
                    var video = document.getElementById('qr-reader-showcast');
                    var canvas = document.getElementById('qr-canvas');
                    var context = canvas.getContext('2d');
                    var localStream;
                    var timer;

                    // use environment camera if possible
                    if (typeof MediaStreamTrack !== 'undefined' && MediaStreamTrack.getSources) {
                        MediaStreamTrack.getSources(function (sources) {
                            var id = null;
                            sources.forEach(function (sourceInfo) {
                                if (sourceInfo.kind === 'video') {
                                    if (id === null) {
                                        id = sourceInfo.id;
                                    }
                                    if (sourceInfo.facing === 'environment') {
                                        id = sourceInfo.id;
                                    }
                                }
                            });
                            startVideo(id);
                        });
                    } else {
                        // use anything if camera selection not supported
                        startVideo(null);
                    }
                }

                if (scope.userMedia) {
                    videoCapture();
                } else {
                    $('#camera-input').on('change', function () {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            qrcode.decode(e.target.result);
                        };
                        reader.readAsDataURL($("#camera-input")[0].files[0]);
                    });

                    qrcode.callback = function (res) {
                        if (res === "error decoding QR Code") {
                            alert("Invalid QR Code. Please try again.");
			    $rootScope.$broadcast("qrCodeFailed");
                            return;
                        }
                        $rootScope.$broadcast("qrCode", res);
                        scope.$apply();
                    };
                }

            }
        }
    }

    maxNumber.$inject = ['$filter'];

    function maxNumber($filter) {
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
    }

    // Slider directive
    function slider() {
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
    }
})();

angular.module("app")
    .controller('howItWorksCtrl', ['$scope', '$timeout',
        function ($scope, $timeout) {
            $scope.currentSlide = 0;

            $scope.slides = [
                {
                    slide: 'assets/i/works-slide-1.png',
                    text: 'A Business wants to grow; \nThe Business offers F$'
                },
                {
                    slide: 'assets/i/works-slide-2.png',
                    text: 'Champions, the Business\'s Loyal Customers, buy the F$ Online & the Business get money right away!'
                },
                {
                    slide: 'assets/i/works-slide-3.png',
                    text: 'Champions post an invite to their friends on social networks bringing more champions'
                },
                {
                    slide: 'assets/i/works-slide-4.png',
                    text: 'Champions can redeem their F$\'s with their smartphones at the Business'
                }
            ];

            var slidesLength = $scope.slides.length;
            $scope.prev = function () {
                $scope.currentSlide = ($scope.currentSlide + slidesLength - 1) % slidesLength;
            };
            $scope.next = function () {
                $scope.currentSlide = ($scope.currentSlide + 1) % slidesLength;
            };
            $scope.setCurrent = function (index) {
                $scope.currentSlide = index;
            };
        }]);

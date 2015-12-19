/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular controller selecting twitter friends modal
 *
 * @version 1.1
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1
 *  - Modified the layout of select twitter friend to include autocomplete
 */

(function () {
    'use strict';

    angular
        .module('app.champion.sendGift')
        .controller('SelectTwitterCtrl', SelectTwitterCtrl);

    SelectTwitterCtrl.$inject = ['$scope', '$modalInstance','twitterFriends'];

    //Twitter select controller
    function SelectTwitterCtrl($scope, $modalInstance, twitterFriends) {
        $scope.vm = {};


        $scope.vm.friends = twitterFriends;
        $scope.vm.disabled = false;

        $scope.vm.response = {};
        $scope.vm.send = send;
        $scope.vm.cancel = cancel;
        $scope.vm.friendSelected = friendSelected;

        return;

        //Send the gift to the selected twitter friend.
        function send() {
            $modalInstance.close($scope.vm.response);
        }

        //Disable the text box once the friend is selected
        function friendSelected() {
            $scope.vm.disabled = true;
            $scope.vm.response.selectedTwitterFriend= $scope.vm.selectedFriend;
            $scope.vm.selectedFriend = '@' + $scope.vm.response.selectedTwitterFriend.screen_name;
        }

        //Cancel modal function
        function cancel() {
            $modalInstance.dismiss();
        }
    }
})();

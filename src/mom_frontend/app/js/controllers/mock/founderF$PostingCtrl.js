/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//FounderF$Posting Controller
angular.module("app")
    .controller("founderF$PostingCtrl", function ($scope, DataService, $rootScope) {
        $rootScope.modal = false;
        //Get History
        //$rootScope.role = 'Founder';
        var promise = DataService.query("post");
        promise.then(function (data) {
            $scope.post = data.post;
            //Set Dropdown
            $scope.myOptions = [
                {
                    name: 'Adventure',
                    value: 'Adventure'
                },
                {
                    name: 'Food & Drink',
                    value: 'Food & Drink'
                },
                {
                    name: 'Flying',
                    value: 'Flying'
                }
            ];
            $scope.business_type = {
                name: $scope.post[0].businessType,
                value: $scope.post[0].businessType
            }
            //Save
            $scope.save = function () {
                if ($scope.form.$valid) {
                    $scope.saveModal = $scope.modal = true;
                }
            }
            //Done
            $scope.done = function () {
                $scope.saveModal = $scope.modal = false;
            }
            //Post
            $scope.postNow = function () {
                if ($scope.form.$valid) {
                    $scope.postModal = $scope.modal = true;
                }
            }
            //Close Modal
            $scope.closeModal = function () {
                $scope.postModal = $scope.saveModal = $scope.modal = false;
            }
        }, function (data) {
        });
    });
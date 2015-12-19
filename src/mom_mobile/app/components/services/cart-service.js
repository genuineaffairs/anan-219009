/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents cart service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('CartService', CartService);

    CartService.$inject = [];

    /**
     * Application service to store data for my cart page.
     */
    function CartService() {

        var service = {
            giftOfferId: null,
            totalValue: null,
            price: null,
            clearCart: clearCart
        };
        return service;


        /**
         * Clears the cart data
         * @since 1.0
         */
        function clearCart() {
            service.giftOfferId = null;
            service.totalValue = null;
            service.price = null;
        }
    }
})();

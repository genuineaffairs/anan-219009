/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents modal service.
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 *  - Included ability to include giftCard details to modal service
 *  - Included setMessage function
 * Changes in version 1.2 (Project Mom and Pop - MiscUpdate5):
 * - Use default message type in showModal
 *
 * Changes in 1.3 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-224] Implement user feedback
 * - Call onClose callback function when modal is closed
 */

/**
 * How to use the User Rating function:
 *
 * 1) Setup the questions users should rate in /assets/data/messages.json:
 *    "idXXX": {
 *      "id": "XXX",
 *      "type": "rate"
 *      "ratings": [{"question": "Please rate us"}]
 *    }
 * 2) Use the modal type 'rate':
 *    $scope.ms.showModal('idXXX', 'rate');
 * 3) Set the ActionRecord search criteria
 *    $scope.ms.currentMessage.ratingId = {
 *      type: 'GIFTED',
 *      giftCardId: giftCardId,
 *      userId: $rootScope.loggedUser.id
 *    };
 */

/* Services */
(function () {
    'use strict';
    angular
        .module('app.components')
        .factory('ModalService', ModalService);

    ModalService.$inject = ['UtilService', 'CommonService'];

    /**
     * Application service to store modal data across controllers
     */
    function ModalService(UtilService, CommonService) {
        var messages = null;

        initService();

        var service = {
            showModal: showModal,
            clearModal: clearModal,
            closeModals: closeModals,
            setMessage: setMessage,
	    saveRating: saveRating,
	    clearRatings: clearRatings,
            flagLogInRequired: false,
            flagSuccessModal: false,
            flagErrorModal: false,
            flagShareSuccess: false,
            flagShareError: false,
            flagOpenShare: false,
            flagContinue: false,
            flagErrorSupport: false,
	    flagRateAppModal: false,
            currentMessage: {},
            offerDetails: null,
            giftCard: null,
            redirectUrl: null,
	    onClose: null
        };
        return service;

        /**
         * Gets all the application messages from messages.json
         * @since 1.0
         */
        function initService() {
            UtilService.getMessages()
                .then(function(result) {
                    messages = result.messages;
                })
        }

        /**
         * Display a modal
         * @param messageId The id of the message to be displayed in the modal
         * @param modalType The type of modal to be displayed. Valid values are alert, login, continue, shareSuccess,
         *                  errorSupport and success
         * @since 1.0
         */
        function showModal(messageId, modalType) {
            if (messages != null) {
                if (messages.hasOwnProperty(messageId)) {
                    service.currentMessage = messages[messageId];
		    if (!modalType) {
			modalType = service.currentMessage.type;
		    }
                    if(modalType === 'alert') {
                        service.flagErrorModal = true;
                    }  else if (modalType === 'login')  {
                        service.flagLogInRequired = true;
                    }  else if (modalType === 'continue')  {
                        service.flagContinue = true;
                    } else if (modalType === 'shareSuccess') {
                        service.flagShareSuccess = true;
                    } else if (modalType === 'errorSupport')  {
                        service.flagErrorSupport = true;
		    } else if (modalType === 'rate') {
			service.flagRateAppModal = true;
                    }else {
                        service.flagSuccessModal = true;
                    }
                }
            }
        }

        /**
         * Clears any modal displayed and the data stored
         * @since 1.0
         */
        function clearModal() {
            service.flagLogInRequired = false;
            service.flagSuccessModal = false;
            service.flagErrorModal = false;
            service.flagShareSuccess = false;
            service.flagShareError = false;
            service.flagOpenShare = false;
            service.flagContinue = false;
            service.flagErrorSupport = false;
	    service.flagRateAppModal = false;
            service.offerDetails = null;
            service.giftCard = null;
            service.redirectUrl = null;
	    service.onClose = null;
            service.currentMessage = {};
        }

        /**
         * Closes all the modals
         * @since 1.0
         */
        function closeModals() {
            service.flagLogInRequired = false;
            service.flagSuccessModal = false;
            service.flagErrorModal = false;
            service.flagShareSuccess = false;
            service.flagShareError = false;
            service.flagOpenShare = false;
            service.flagContinue = false;
            service.flagErrorSupport = false;
	    service.flagRateAppModal = false;
	    if (service.onClose) {
		service.onClose();
	    }
        }

        /**
         * Set the custom message
         * @param id message id
         * @param title message title
         * @since 1.1
         */
        function setMessage(id, title) {
            if (messages != null) {
                if (messages.hasOwnProperty(id)) {
                    messages[id].title = title;
                }
            }
        }

	/**
	 * Save the user rating
	 */
	function saveRating() {
	    var ratings = service.currentMessage.ratings;
	    var data = service.currentMessage.ratingId;
	    data.ratings = [];
	    ratings.forEach(function(r) {
		data.ratings.push(parseInt(r.rating));
	    });
	    var req = {
                method: 'POST',
                url: '/actionRecord/rating',
                data: data
            };
            return CommonService.makeRequest(req);
	}

	/**
	 * Clear ratings
	 */
	function clearRatings() {
	    service.currentMessage.ratings.forEach(function(r) {
		r.rating = 0;
	    });
	}
    }
})();

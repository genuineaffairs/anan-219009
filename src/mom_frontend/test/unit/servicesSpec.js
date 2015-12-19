'use strict';

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Test cases for services layer.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
describe('BusinessService tests', function (){
  var factory;
  var httpBackend = null;
  
  beforeEach(function (){
    //load the module.
    module("app");

    //inject your factory for testing.
    inject(function(BusinessService, storage, $httpBackend, config) {
      factory = BusinessService;

      httpBackend=$httpBackend;
      httpBackend.when("PUT", config.REST_SERVICE_BASE_URL + "/businesses/me").respond('success');
    });
  });
     
  
  it('test business service', function (){
    spyOn(sessionStorage, 'getItem');
    
    factory.updateMyBusinessProfile(null).then(function (payload) {
        expect(payload).toBe('success');
    }, function (reason) {
        console.log('fail to call:' + reason);
    });
    httpBackend.flush();
    expect(sessionStorage.getItem).toHaveBeenCalled();
  });
});

describe('GiftCardOfferService tests', function (){
    var factory;
    var httpBackend = null;

    //executed before each "it" is run.
    beforeEach(function (){
        //load the module.
        module("app");

        //inject your factory for testing.
        inject(function(GiftCardOfferService, storage, $httpBackend, config) {
            factory = GiftCardOfferService;
            httpBackend=$httpBackend;
            httpBackend.when("POST", config.REST_SERVICE_BASE_URL + "/giftCards").respond('success');
        });
    });

    it('test GiftCardOfferService service', function (){
        spyOn(sessionStorage, 'getItem');

        factory.purchase(null).then(function (payload) {
            expect(payload).toBe('success');
        }, function (reason) {
            console.log('fail to call:' + reason);
        });
        httpBackend.flush();
        expect(sessionStorage.getItem).toHaveBeenCalled();
    });


});

describe('NotificationService tests', function (){
    var factory;
    var httpBackend = null;

    beforeEach(function (){
        //load the module.
        module("app");

        //inject your factory for testing.
        inject(function(NotificationService, storage, $httpBackend, config) {
            factory = NotificationService;
            httpBackend=$httpBackend;
            httpBackend.when("POST", config.REST_SERVICE_BASE_URL + "/feedbacks").respond('success');
            httpBackend.when("POST", config.REST_SERVICE_BASE_URL + "/abuses").respond('success');
        });
    });

    it('test NotificationService service', function (){
        spyOn(sessionStorage, 'getItem');

        factory.sendFeedback(null).then(function (payload) {
            expect(payload).toBe('success');
        }, function (reason) {
            console.log('fail to call:' + reason);
        });
        httpBackend.flush();
        expect(sessionStorage.getItem).toHaveBeenCalled();
    });

    it('test NotificationService service', function (){
        spyOn(sessionStorage, 'getItem');

        factory.reportAbuse(null).then(function (payload) {
            expect(payload).toBe('success');
        }, function (reason) {
            console.log('fail to call:' + reason);
        });
        httpBackend.flush();
        expect(sessionStorage.getItem).toHaveBeenCalled();
    });
});

describe('SecurityService tests', function (){
    var factory;
    var httpBackend = null;

    beforeEach(function (){
        //load the module.
        module("app");

        //inject your factory for testing.
        inject(function(SecurityService, storage, $httpBackend, config) {
            factory = SecurityService;

            httpBackend=$httpBackend;
            httpBackend.when("POST", config.REST_SERVICE_BASE_URL + "/resetPassword").respond('success');
        });
    });

    it('test SecurityService service', function (){
        spyOn(sessionStorage, 'getItem');

        factory.resetPassword(null).then(function (payload) {
            expect(payload).toBe('success');
        }, function (reason) {
            console.log('fail to call:' + reason);
        });
        httpBackend.flush();
        expect(sessionStorage.getItem).toHaveBeenCalled();
    });
});

describe('UserService tests', function (){
    var factory;
    var httpBackend = null;

    beforeEach(function (){
        //load the module.
        module("app");

        //inject your factory for testing.
        inject(function(UserService, storage, $httpBackend, config) {
            factory = UserService;

            httpBackend=$httpBackend;
            httpBackend.when("GET", config.REST_SERVICE_BASE_URL + "/users/me/actionRecords?pageNumber=0" +
                "&userId=mock&sortBy=timestamp&sortOrder=Descending").respond('success');
        });

    });

    it('test business service', function (){
        spyOn(sessionStorage, 'getItem');

        factory.getActionRecords( {
            userId : 'mock',
            sortBy : 'timestamp',
            sortOrder : 'Descending'
        }).then(function (payload) {
            expect(payload).toBe('success');
        }, function (reason) {
            console.log('fail to call:' + reason);
        });
        httpBackend.flush();
        expect(sessionStorage.getItem).toHaveBeenCalled();
    });
});
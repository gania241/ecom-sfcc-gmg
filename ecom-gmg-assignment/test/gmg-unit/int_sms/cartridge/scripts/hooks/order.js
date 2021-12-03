'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();


describe('int_sms/cartridge/scripts/hooks/order', function () {

    global.empty = function empty(input) {
        return (input === null);
    };

    class Status {
        static OK = true;
        constructor(flag) {
            this.success = flag;
        }
    };

    var loggerError = {
        error: function name(msg, args) {
        }
    };

    var smsService = {
        send: function name(customerPhone, orderNo) {
            return {
                ok: true
            };
        }
    };

    var order = proxyquire('../../../../../../cartridges/int_sms/cartridge/scripts/hooks/order', {
        'dw/system/Logger': {
            getLogger: function (logName, fileName) {
                return loggerError;
            }
        },
        '*/cartridge/scripts/services/smsService': smsService,
        'dw/system/Status': Status,
        '*/cartridge/scripts/chain': {
            safeGet: function (object, chain, defaultValue) {
                if (object === null || object !== Object(object)) {
                    return defaultValue;
                }
                if (!chain) {
                    return object;
                }
                var prop,
                    props = chain.split('.');
                for (var q = 0, len = props.length; q < len; q++) {
                    prop = props[q];
                    if (prop in object && typeof object[prop] !== 'undefined' && object[prop] !== null) {
                        object = object[prop];
                    } else {
                        return defaultValue;
                    }
                }
                return object;
            }
        }
    });
    var smsServiceSpy = sinon.spy(smsService, 'send');
    it('Case1: If order has phone - success case no error log', function () {
        var orderData = {
            billingAddress: {
                phone: '9632475100'
            },
            orderNo: 'SFRA123456'
        };
        order.afterOrderPlace(orderData);
        assert.isTrue(smsServiceSpy.calledWith('9632475100', 'SFRA123456'));
        assert.isTrue(smsServiceSpy.returnValues[0].ok);
        smsServiceSpy.reset();
    });

    it('Case2: If order has no phone - no service call , error log', function () {
        var orderData = {
            billingAddress: {
            },
            orderNo: 'SFRA123456'
        };
        order.afterOrderPlace(orderData);
        assert.isTrue(smsServiceSpy.notCalled);
        smsServiceSpy.reset();
    });
});